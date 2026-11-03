// ============================================================================
// Cookie & Local Session Management Utility
// ============================================================================

export function setCookie(name, value, days = 365) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (e) {
    console.error('Failed to set cookie:', e);
  }
}

export function getCookie(name) {
  try {
    const nameEQ = encodeURIComponent(name) + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function deleteCookie(name) {
  try {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  } catch (e) {}
}

const SESSION_COOKIE_KEY = 'smjv26_auth_user';
const PLAYER_STORAGE_KEY = 'smjv26.player';

export function saveUserSession(userData) {
  if (!userData) return;
  // Save credentials and session in browser cookie
  const sessionPayload = {
    email: userData.email,
    password: userData.password,
    grNo: userData.grNo,
    name: userData.name,
    surname: userData.surname,
    loginTimestamp: Date.now()
  };
  setCookie(SESSION_COOKIE_KEY, JSON.stringify(sessionPayload), 365);

  // Also persist complete profile in localStorage
  try {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(userData));
  } catch (e) {}
}

export function getUserSession() {
  // Check cookie first
  const cookieRaw = getCookie(SESSION_COOKIE_KEY);
  let sessionData = null;
  if (cookieRaw) {
    try {
      sessionData = JSON.parse(cookieRaw);
    } catch (e) {}
  }

  // Check stored full player profile
  let storedPlayer = null;
  try {
    const playerRaw = localStorage.getItem(PLAYER_STORAGE_KEY);
    if (playerRaw) storedPlayer = JSON.parse(playerRaw);
  } catch (e) {}

  return {
    hasCookieSession: !!sessionData,
    session: sessionData,
    player: storedPlayer || sessionData
  };
}

export function clearUserSession() {
  deleteCookie(SESSION_COOKIE_KEY);
  try {
    localStorage.removeItem(PLAYER_STORAGE_KEY);
  } catch (e) {}
}
