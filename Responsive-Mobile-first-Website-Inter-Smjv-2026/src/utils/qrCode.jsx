// ============================================================================
// Compact Self-Contained QR Code Generator (Pure JavaScript, 0 Dependencies)
// Based on ISO/IEC 18004 QR Code Specification (Byte mode, Error Correction M)
// ============================================================================

// Galois Field GF(256) tables with primitive polynomial 0x11d (285)
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) {
  EXP[i] = x;
  EXP[i + 255] = x;
  LOG[x] = i;
  x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
}

function gfMul(x, y) {
  if (x === 0 || y === 0) return 0;
  return EXP[LOG[x] + LOG[y]];
}

// Compute Reed-Solomon generator polynomial for degree eccCount
function rsGenerator(eccCount) {
  let g = [1];
  for (let i = 0; i < eccCount; i++) {
    const next = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      next[j] ^= gfMul(g[j], EXP[i]);
      next[j + 1] ^= g[j];
    }
    g = next;
  }
  return g;
}

// Compute Reed-Solomon error correction codewords
function rsEncode(data, eccCount) {
  const gen = rsGenerator(eccCount);
  const res = new Array(eccCount).fill(0);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ res[0];
    res.shift();
    res.push(0);
    if (factor !== 0) {
      for (let j = 0; j < eccCount; j++) {
        res[j] ^= gfMul(gen[j + 1], factor);
      }
    }
  }
  return res;
}

// QR Code Versions specs for Error Correction Level M:
// [version, totalModules, totalCodewords, dataCodewords, eccCodewords]
const QR_VERSIONS = [
  null,
  { version: 1, size: 21, totalCW: 26, dataCW: 16, eccCW: 10, align: [] },
  { version: 2, size: 25, totalCW: 44, dataCW: 28, eccCW: 16, align: [6, 18] },
  { version: 3, size: 29, totalCW: 70, dataCW: 44, eccCW: 26, align: [6, 22] },
  { version: 4, size: 33, totalCW: 100, dataCW: 64, eccCW: 36, align: [6, 26] },
  { version: 5, size: 37, totalCW: 134, dataCW: 86, eccCW: 48, align: [6, 30] },
  { version: 6, size: 41, totalCW: 172, dataCW: 108, eccCW: 64, align: [6, 34] },
];

export function createQRCodeMatrix(text) {
  // UTF-8 encode string
  const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : { encode: s => Buffer.from(s) };
  const utf8 = Array.from(encoder.encode(text));

  // Find lowest suitable QR Version
  let targetVer = null;
  for (let v = 1; v < QR_VERSIONS.length; v++) {
    const info = QR_VERSIONS[v];
    // Byte mode overhead: 4 bits mode + 8 bits length (for ver 1-9) + data bytes
    const requiredBits = 4 + 8 + (utf8.length * 8);
    const availableBits = info.dataCW * 8;
    if (requiredBits <= availableBits) {
      targetVer = info;
      break;
    }
  }

  if (!targetVer) {
    targetVer = QR_VERSIONS[6];
  }

  const { size, dataCW, eccCW, align } = targetVer;

  // Build Bit Stream (Mode 0100 for Byte mode)
  let bits = '';
  bits += '0100'; // 4 bits byte mode
  const lenBits = utf8.length.toString(2).padStart(8, '0');
  bits += lenBits;

  for (const b of utf8) {
    bits += b.toString(2).padStart(8, '0');
  }

  // Terminator (up to 4 zeroes)
  const maxBits = dataCW * 8;
  const termLen = Math.min(4, maxBits - bits.length);
  for (let i = 0; i < termLen; i++) bits += '0';

  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits += '0';

  // Pad with alternating 11101100 (236) and 00010001 (17)
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < maxBits) {
    bits += padBytes[padIdx % 2].toString(2).padStart(8, '0');
    padIdx++;
  }

  // Convert bit string to data codewords
  const dataBytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    dataBytes.push(parseInt(bits.slice(i, i + 8), 2));
  }

  // Calculate ECC codewords
  const eccBytes = rsEncode(dataBytes, eccCW);
  const allCodewords = [...dataBytes, ...eccBytes];

  // Initialize Matrix & Reserved Mask
  const matrix = Array.from({ length: size }, () => new Array(size).fill(false));
  const isReserved = Array.from({ length: size }, () => new Array(size).fill(false));

  function setModule(r, c, val, reserved = true) {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r][c] = !!val;
      if (reserved) isReserved[r][c] = true;
    }
  }

  // Finder Patterns (7x7) + Separators
  function drawFinder(topR, leftC) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const row = topR + r;
        const col = leftC + c;
        if (row < 0 || row >= size || col < 0 || col >= size) continue;

        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
          const isBlack = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          setModule(row, col, isBlack);
        } else {
          setModule(row, col, false);
        }
      }
    }
  }

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Alignment Pattern
  if (align.length > 1) {
    const pos = align[1]; // for ver 2-6 simple 1 align pos
    for (let r = pos - 2; r <= pos + 2; r++) {
      for (let c = pos - 2; c <= pos + 2; c++) {
        if (!isReserved[r][c]) {
          const isBlack = (r === pos - 2 || r === pos + 2 || c === pos - 2 || c === pos + 2 || (r === pos && c === pos));
          setModule(r, c, isBlack);
        }
      }
    }
  }

  // Timing Patterns (row 6 and col 6)
  for (let i = 8; i < size - 8; i++) {
    if (!isReserved[6][i]) setModule(6, i, i % 2 === 0);
    if (!isReserved[i][6]) setModule(i, 6, i % 2 === 0);
  }

  // Dark module (always black)
  setModule(size - 8, 8, true);

  // Reserve Format Info areas
  for (let i = 0; i < 9; i++) {
    if (!isReserved[8][i]) isReserved[8][i] = true;
    if (!isReserved[i][8]) isReserved[i][8] = true;
  }
  for (let i = size - 8; i < size; i++) {
    if (!isReserved[8][i]) isReserved[8][i] = true;
    if (!isReserved[i][8]) isReserved[i][8] = true;
  }

  // Convert allCodewords into bit array
  const fullBits = [];
  for (const byte of allCodewords) {
    for (let b = 7; b >= 0; b--) {
      fullBits.push(((byte >> b) & 1) === 1);
    }
  }

  // Place data modules in zigzag 2-column paths
  let bitIdx = 0;
  let upwards = true;
  for (let c = size - 1; c > 0; c -= 2) {
    if (c === 6) c--; // skip vertical timing line
    for (let r = 0; r < size; r++) {
      const row = upwards ? size - 1 - r : r;
      for (let col = c; col >= c - 1; col--) {
        if (!isReserved[row][col]) {
          const val = bitIdx < fullBits.length ? fullBits[bitIdx++] : false;
          // Apply standard Mask 0: (row + col) % 2 === 0
          const mask = (row + col) % 2 === 0;
          matrix[row][col] = val ^ mask;
        }
      }
    }
    upwards = !upwards;
  }

  // Format info for Error Correction M (00) + Mask 0 (000)
  // Format bit string with BCH error correction and XOR mask 0x5412: 101010000010010
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];

  // Top-left format bits
  setModule(8, 0, formatBits[0]);
  setModule(8, 1, formatBits[1]);
  setModule(8, 2, formatBits[2]);
  setModule(8, 3, formatBits[3]);
  setModule(8, 4, formatBits[4]);
  setModule(8, 5, formatBits[5]);
  setModule(8, 7, formatBits[6]);
  setModule(8, 8, formatBits[7]);
  setModule(7, 8, formatBits[8]);
  setModule(5, 8, formatBits[9]);
  setModule(4, 8, formatBits[10]);
  setModule(3, 8, formatBits[11]);
  setModule(2, 8, formatBits[12]);
  setModule(1, 8, formatBits[13]);
  setModule(0, 8, formatBits[14]);

  // Bottom-left and Top-right format bits
  for (let i = 0; i < 7; i++) {
    setModule(size - 1 - i, 8, formatBits[i]);
  }
  for (let i = 0; i < 8; i++) {
    setModule(8, size - 8 + i, formatBits[7 + i]);
  }

  return matrix;
}

// React Component to render crisp SVG QR code with quiet zone & center logo badge
export function QRCodeView({ value, size = 160, className = "" }) {
  const matrix = createQRCodeMatrix(value || "INTER SMJV 2026");
  const moduleCount = matrix.length;
  const padding = 2; // quiet zone in modules
  const totalSize = moduleCount + padding * 2;

  return (
    <svg 
      className={`inline-block ${className}`}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      style={{ width: size, height: size }}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={totalSize} height={totalSize} fill="#FFFFFF" rx="2" />
      <g fill="#070B1E" transform={`translate(${padding}, ${padding})`}>
        {matrix.map((row, r) =>
          row.map((val, c) => (
            val ? (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width={1}
                height={1}
                rx={0.15}
              />
            ) : null
          ))
        )}
      </g>
    </svg>
  );
}
