// ============================================================================
// INTER SMJV 2026 — Comprehensive Multi-Stage Competition Registration Flow
// Stage 1: Basic Profile (Before Verification)
// Stage 2: Dual Verification (Email & Mobile OTP)
// Stage 3: General Information (After Verification)
// Stage 4: Participation & Sports Selection (Male Rule / Female Coming Soon)
// Stage 5: Accreditation Pass with Real QR Code & Cookie Session Persistence
// ============================================================================

import React, { useState, useEffect } from 'react';
import { QRCodeView } from '../utils/qrCode.jsx';
import { saveUserSession } from '../utils/cookie.js';
import { SMJV_BRANCHES } from '../data/tournamentData.js';
import DateOfBirthPicker from './DateOfBirthPicker.jsx';


const MALE_OUTDOOR_SPORTS = ['Cricket', 'Football', 'Volleyball'];
const MALE_INDOOR_SPORTS = ['Table Tennis', 'Chess', 'Badminton', 'Pickleball', 'Carrom'];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PANT_SIZES = ['28', '30', '32', '34', '36', '38', '40'];
const YEARS_OF_STUDY = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Post Graduate / Masters', 'PhD / Research'];
const RELATIONS = ['Father', 'Mother', 'Brother', 'Sister', 'Guardian', 'Relative'];

export default function RegistrationFlow({ setPlayer, navigateTo, addToast, onOpenIdCard }) {
  // Current active step: 1 = Basic, 2 = Verify, 3 = General, 4 = Sports/Role, 5 = Complete
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Before Verification
    name: '',
    middlename: '',
    surname: '',
    email: '',
    password: '',
    mobile: '',
    gender: 'Male',
    grNo: '',

    // Step 2: Verification
    emailOtp: '',
    mobileOtp: '',
    isEmailVerified: false,
    isMobileVerified: false,

    // Step 3: General Questions (After Verification)
    dob: '',
    photo: '',
    branch: 'Vadodara (Host Branch)',
    age: '',
    hometown: '',
    college: '',
    course: '',
    year: '1st Year',
    bloodGroup: 'B+',
    emergencyContact: '',
    emergencyRelation: 'Father',

    // Step 4: Participation & Sports
    role: 'Sports Team', // 'Sports Team' | 'Cultural Team' | 'Visitor'
    tshirtSize: 'L',
    pantSize: '32',
    sports: [],
    culturalActivities: ['Garba / Folk Dance'],
    acceptedTerms: true,
  });

  // Simulated OTP Codes
  const [simulatedOtps, setSimulatedOtps] = useState({ email: '748291', mobile: '938102' });
  const [otpSentNotification, setOtpSentNotification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto calculate age when DOB changes
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge > 0 && calculatedAge < 100) {
        setFormData(prev => ({ ...prev, age: String(calculatedAge) }));
      }
    }
  }, [formData.dob]);

  // Handle Image Upload with Base64 conversion
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('File size exceeds 4MB. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
        addToast('Photo Uploaded', 'Participant portrait preview updated', 'checkCircle');
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1 Validation & Proceed to Verification
  const handleProceedToVerification = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.surname.trim()) {
      alert('Please enter your First Name and Surname.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      alert('Please enter a valid Email ID.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit Mobile Number.');
      return;
    }
    if (!formData.grNo.trim()) {
      alert('Please enter your Hostel G.R. Number (e.g. SMJV26-0142).');
      return;
    }

    // Generate random realistic OTPs for testing
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const mobileCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtps({ email: emailCode, mobile: mobileCode });
    setOtpSentNotification(true);

    setCurrentStep(2);
    addToast('Verification Sent', `OTP codes sent to ${formData.email} and ${formData.mobile}`, 'bell');
  };

  // Verification Handlers
  const verifyEmail = () => {
    if (formData.emailOtp.trim() === simulatedOtps.email || formData.emailOtp.trim() === '123456') {
      setFormData(prev => ({ ...prev, isEmailVerified: true }));
      addToast('Email Verified', 'Email address verified successfully!', 'checkCircle');
    } else {
      alert(`Invalid Email OTP. Please enter the code shown in the banner (${simulatedOtps.email}) or click 'Quick Verify'.`);
    }
  };

  const verifyMobile = () => {
    if (formData.mobileOtp.trim() === simulatedOtps.mobile || formData.mobileOtp.trim() === '123456') {
      setFormData(prev => ({ ...prev, isMobileVerified: true }));
      addToast('Mobile Verified', 'Mobile number verified successfully!', 'checkCircle');
    } else {
      alert(`Invalid Mobile OTP. Please enter the code shown in the banner (${simulatedOtps.mobile}) or click 'Quick Verify'.`);
    }
  };

  const quickVerifyAll = () => {
    setFormData(prev => ({
      ...prev,
      emailOtp: simulatedOtps.email,
      mobileOtp: simulatedOtps.mobile,
      isEmailVerified: true,
      isMobileVerified: true
    }));
    addToast('Verified!', 'Both Email and Mobile verified instantly.', 'checkCircle');
  };

  const handleProceedToGeneral = () => {
    if (!formData.isEmailVerified || !formData.isMobileVerified) {
      alert('Please verify both your Email and Mobile number before proceeding.');
      return;
    }
    setCurrentStep(3);
  };

  // Step 3 Validation & Proceed to Sports / Role
  const handleProceedToSports = (e) => {
    e.preventDefault();
    if (!formData.dob) {
      alert('Please select your Date of Birth.');
      return;
    }
    if (!formData.emergencyContact.trim() || formData.emergencyContact.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit Emergency Contact Number.');
      return;
    }
    setCurrentStep(4);
  };

  // Sports Selection Logic for Males (2 Outdoor + 1 Indoor OR 1 Outdoor + 2 Indoor)
  const outdoorSelected = formData.sports.filter(s => MALE_OUTDOOR_SPORTS.includes(s));
  const indoorSelected = formData.sports.filter(s => MALE_INDOOR_SPORTS.includes(s));
  
  const isRuleValid = (
    (outdoorSelected.length === 2 && indoorSelected.length === 1) ||
    (outdoorSelected.length === 1 && indoorSelected.length === 2)
  );

  const toggleSport = (sportName, type) => {
    setFormData(prev => {
      const exists = prev.sports.includes(sportName);
      let updated = [];

      if (exists) {
        updated = prev.sports.filter(s => s !== sportName);
      } else {
        // Enforce max combination logic
        if (prev.gender === 'Male') {
          if (type === 'outdoor') {
            if (outdoorSelected.length >= 2) {
              alert('You can select a maximum of 2 Outdoor sports (Combination must be 2 Outdoor + 1 Indoor, or 1 Outdoor + 2 Indoor).');
              return prev;
            }
          } else if (type === 'indoor') {
            if (indoorSelected.length >= 2) {
              alert('You can select a maximum of 2 Indoor sports (Combination must be 2 Outdoor + 1 Indoor, or 1 Outdoor + 2 Indoor).');
              return prev;
            }
          }
          if (prev.sports.length >= 3) {
            alert('A player can choose exactly 3 sports: either (2 Outdoor + 1 Indoor) or (1 Outdoor + 2 Indoor). Deselect one to change.');
            return prev;
          }
        }
        updated = [...prev.sports, sportName];
      }

      return { ...prev, sports: updated };
    });
  };

  // Final Registration Submission
  const handleFinalSubmit = (e) => {
    e.preventDefault();

    if (formData.role === 'Sports Team') {
      if (formData.gender === 'Male' && !isRuleValid) {
        alert('Please complete your sports selection according to the rule:\nEither 2 Outdoor + 1 Indoor sports, OR 1 Outdoor + 2 Indoor sports (Total 3 sports).');
        return;
      }
      if (formData.gender === 'Female' && formData.sports.length === 0) {
        alert('Please select your preferred indoor sports.');
        return;
      }
    }

    if (!formData.acceptedTerms) {
      alert('Please accept the rules and regulations to proceed.');
      return;
    }

    // Prepare complete profile payload
    const completeProfile = {
      ...formData,
      fullName: [formData.name, formData.middlename, formData.surname].filter(Boolean).join(' '),
      registrationDate: new Date().toISOString(),
      hostel: formData.branch.split(' ')[0] || 'Narmada',
      gr: formData.grNo,
    };

    // Save login credentials to cookies and session storage
    saveUserSession(completeProfile);

    // Update global app state
    setPlayer(completeProfile);
    setCurrentStep(5);

    addToast(
      'Registration Complete! 🎉', 
      'Your profile and official ID badge have been generated. Login credentials saved to cookies.', 
      'checkCircle'
    );
  };

  // QR Code Payload string
  const qrString = JSON.stringify({
    event: "INTER SMJV 2026",
    gr: formData.grNo || "SMJV26-0142",
    name: `${formData.name} ${formData.surname}`,
    role: formData.role,
    branch: formData.branch,
    sports: formData.sports,
    verified: true
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Page Title & Stage Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold tracking-widest uppercase text-saffron block">
            <span className="font-gu text-marigold">નોંધણી પોર્ટલ</span> · Official Competition Accreditation
          </span>
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            Step {currentStep} of 5
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
          Festival Registration & Digital Pass
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Follow the step-by-step accreditation process. Your login credentials will be saved in your browser for seamless access.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center">
        {[
          { step: 1, label: 'Identity' },
          { step: 2, label: 'Verify' },
          { step: 3, label: 'General' },
          { step: 4, label: 'Sports' },
          { step: 5, label: 'Pass' },
        ].map(item => (
          <div key={item.step} className="space-y-1.5">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStep >= item.step 
                  ? 'bg-gradient-to-r from-marigold to-saffron shadow-sm shadow-amber-400/30' 
                  : 'bg-white/10'
              }`}
            />
            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider block ${
              currentStep === item.step ? 'text-amber-300' : currentStep > item.step ? 'text-white' : 'text-ink-muted'
            }`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* STAGE 1: BEFORE VERIFICATION (Basic Profile & Identity)             */}
      {/* ==================================================================== */}
      {currentStep === 1 && (
        <form onSubmit={handleProceedToVerification} className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl uppercase tracking-wider text-saffron flex items-center gap-2">
                <span>01</span> <span>Account Setup & Personal Identity</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Please provide your fundamental details. We will verify your email and phone number in the next step.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* First Name */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
                />
              </div>

              {/* Middle Name */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajeshbhai"
                  value={formData.middlename}
                  onChange={e => setFormData({ ...formData, middlename: e.target.value })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
                />
              </div>

              {/* Surname */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  Surname *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mehta"
                  value={formData.surname}
                  onChange={e => setFormData({ ...formData, surname: e.target.value })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email ID */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  Email ID (For Verification & Login) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="aarav.mehta@smjv.edu"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block">
                    Password (Stored in cookies for auto-login) *
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-marigold font-bold hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  Mobile Number (For Verification SMS) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs text-ink-muted font-mono font-bold">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98250 40142"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-[#070B1E] border border-white/15 rounded-xl pl-12 pr-4 py-3 text-xs text-white focus:outline-none focus:border-marigold font-mono"
                  />
                </div>
              </div>

              {/* G.R. Number */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  Hostel G.R. No. (Student Roll Number) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SMJV26-0142"
                  value={formData.grNo}
                  onChange={e => setFormData({ ...formData, grNo: e.target.value.toUpperCase() })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white font-mono uppercase focus:outline-none focus:border-marigold"
                />
              </div>

              {/* Gender */}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-2">
                  Gender * (Determines sports categories)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        formData.gender === g
                          ? 'bg-gradient-to-r from-marigold to-saffron text-black border-amber-300 shadow-md font-extrabold'
                          : 'bg-white/5 border-white/10 text-ink-muted hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-marigold via-amber-400 to-saffron hover:from-amber-300 hover:to-orange-500 shadow-lg shadow-amber-500/20 transition-all hover:scale-102 active:scale-98"
              >
                Proceed to Verification →
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ==================================================================== */}
      {/* STAGE 2: DUAL VERIFICATION (Email & Mobile OTP)                      */}
      {/* ==================================================================== */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl uppercase tracking-wider text-saffron flex items-center gap-2">
                <span>02</span> <span>Verify Email & Mobile Number</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                We take student security seriously. Please verify your contact information to activate your portal pass.
              </p>
            </div>

            {/* Simulated OTP Notification Banner */}
            {otpSentNotification && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/40 text-xs text-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-white">
                    <span>🔔</span> Security Verification Simulator
                  </span>
                  <button
                    onClick={quickVerifyAll}
                    className="px-3 py-1 rounded-lg bg-amber-400 text-black font-extrabold text-[10px] uppercase tracking-wider shadow hover:bg-amber-300 transition-all"
                  >
                    ⚡ Quick Verify Both
                  </button>
                </div>
                <p className="text-[11px] text-ink-sub">
                  Simulated OTPs sent: Email Code: <strong className="font-mono text-white bg-black/40 px-1.5 py-0.5 rounded">{simulatedOtps.email}</strong> · Mobile Code: <strong className="font-mono text-white bg-black/40 px-1.5 py-0.5 rounded">{simulatedOtps.mobile}</strong>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Email Verification Box */}
              <div className={`p-5 rounded-2xl border transition-all ${
                formData.isEmailVerified ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/10 bg-white/5'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span>📧</span> Email Verification
                  </span>
                  {formData.isEmailVerified ? (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500 text-black font-mono">
                      VERIFIED ✓
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-mono">Pending</span>
                  )}
                </div>

                <p className="text-xs text-ink-muted truncate mb-3 font-mono">
                  Destination: <strong className="text-white">{formData.email}</strong>
                </p>

                {!formData.isEmailVerified ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={formData.emailOtp}
                        onChange={e => setFormData({ ...formData, emailOtp: e.target.value })}
                        className="flex-1 bg-[#070B1E] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono tracking-widest text-center focus:outline-none focus:border-marigold"
                      />
                      <button
                        type="button"
                        onClick={verifyEmail}
                        className="px-4 py-2 rounded-xl bg-saffron text-black font-bold text-xs uppercase hover:bg-amber-400"
                      >
                        Verify
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, emailOtp: simulatedOtps.email }))}
                      className="text-[10px] text-marigold font-bold hover:underline block"
                    >
                      Fill sample code ({simulatedOtps.email})
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                    <span>✓</span> Verified and linked to student account.
                  </p>
                )}
              </div>

              {/* Mobile Verification Box */}
              <div className={`p-5 rounded-2xl border transition-all ${
                formData.isMobileVerified ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/10 bg-white/5'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span>📱</span> Mobile Verification
                  </span>
                  {formData.isMobileVerified ? (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500 text-black font-mono">
                      VERIFIED ✓
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-mono">Pending</span>
                  )}
                </div>

                <p className="text-xs text-ink-muted truncate mb-3 font-mono">
                  Destination: <strong className="text-white">+91 {formData.mobile}</strong>
                </p>

                {!formData.isMobileVerified ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={formData.mobileOtp}
                        onChange={e => setFormData({ ...formData, mobileOtp: e.target.value })}
                        className="flex-1 bg-[#070B1E] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono tracking-widest text-center focus:outline-none focus:border-marigold"
                      />
                      <button
                        type="button"
                        onClick={verifyMobile}
                        className="px-4 py-2 rounded-xl bg-saffron text-black font-bold text-xs uppercase hover:bg-amber-400"
                      >
                        Verify
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mobileOtp: simulatedOtps.mobile }))}
                      className="text-[10px] text-marigold font-bold hover:underline block"
                    >
                      Fill sample code ({simulatedOtps.mobile})
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                    <span>✓</span> Mobile number authenticated.
                  </p>
                )}
              </div>

            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-bold uppercase text-ink-muted hover:text-white"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleProceedToGeneral}
                disabled={!formData.isEmailVerified || !formData.isMobileVerified}
                className={`px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${
                  formData.isEmailVerified && formData.isMobileVerified
                    ? 'text-black bg-gradient-to-r from-marigold to-saffron shadow-lg shadow-amber-500/20 hover:scale-102 cursor-pointer'
                    : 'bg-white/10 text-ink-muted cursor-not-allowed opacity-60'
                }`}
              >
                Proceed to General Questions →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* STAGE 3: GENERAL QUESTIONS (After Verification)                     */}
      {/* ==================================================================== */}
      {currentStep === 3 && (
        <form onSubmit={handleProceedToSports} className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl uppercase tracking-wider text-saffron flex items-center gap-2">
                <span>03</span> <span>General Student Information</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                All details below appear on your official accreditation badge and tournament records.
              </p>
            </div>

            {/* Photo Upload & Preview Row */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-24 h-24 rounded-2xl bg-[#070B1E] border-2 border-amber-400/60 overflow-hidden flex items-center justify-center relative shadow-lg flex-shrink-0">
                {formData.photo ? (
                  <img src={formData.photo} alt="Student Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-ink-muted">
                    <span className="text-2xl block">📷</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider block mt-1">No Photo</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1 text-center sm:text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-white block">
                  Upload Official Photo / Portrait *
                </label>
                <p className="text-[11px] text-ink-muted">
                  Clear front-facing passport-style photograph (JPG, PNG up to 4MB).
                </p>
                <div className="pt-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-ink-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-saffron file:text-black hover:file:bg-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Date of Birth & Age / Blood Group Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              {/* Date of Birth (2 Columns for spacious, clear selection) */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                <DateOfBirthPicker
                  value={formData.dob}
                  onChange={(dateStr) => setFormData(prev => ({ ...prev, dob: dateStr }))}
                  calculatedAge={formData.age}
                />
              </div>

              {/* Age & Blood Group Column */}
              <div className="space-y-4">
                {/* Age */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    required
                    min={14}
                    max={40}
                    placeholder="Auto-calculated from DOB"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-marigold font-bold"
                  />
                  <span className="text-[9px] text-ink-muted block mt-1">
                    Auto-computed from birthdate
                  </span>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* SMJV Branch */}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  Which SMJV Branch are you from? *
                </label>
                <select
                  value={formData.branch}
                  onChange={e => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold font-semibold"
                >
                  {SMJV_BRANCHES.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Home Town */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  Home Town *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surat / Rajkot"
                  value={formData.hometown}
                  onChange={e => setFormData({ ...formData, hometown: e.target.value })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
                />
              </div>

              {/* College */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  College / University Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MSU Baroda / Parul Univ"
                  value={formData.college}
                  onChange={e => setFormData({ ...formData, college: e.target.value })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
                />
              </div>

              {/* Course */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  Course Pursuing *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Computer / B.Com"
                  value={formData.course}
                  onChange={e => setFormData({ ...formData, course: e.target.value })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
                />
              </div>

              {/* Year of Study */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  Current Year of Study *
                </label>
                <select
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
                >
                  {YEARS_OF_STUDY.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Emergency Contact */}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  Emergency Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="Parent / Guardian 10-digit number"
                  value={formData.emergencyContact}
                  onChange={e => setFormData({ ...formData, emergencyContact: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-marigold"
                />
              </div>

              {/* Relation to Emergency Contact */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
                  Relation to Emergency Contact *
                </label>
                <select
                  value={formData.emergencyRelation}
                  onChange={e => setFormData({ ...formData, emergencyRelation: e.target.value })}
                  className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
                >
                  {RELATIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-bold uppercase text-ink-muted hover:text-white"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-marigold to-saffron shadow-lg shadow-amber-500/20 hover:scale-102 transition-all cursor-pointer"
              >
                Next: Participation & Sports →
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ==================================================================== */}
      {/* STAGE 4: PARTICIPATION ROLE & SPORTS SELECTION                      */}
      {/* ==================================================================== */}
      {currentStep === 4 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl uppercase tracking-wider text-saffron flex items-center gap-2">
                <span>04</span> <span>Participation Role & Sports Selection</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Choose your participation tier and select your events following the tournament quota rules.
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-2">
                Are you participating in a Sports Team, Cultural Team, or as a Visitor? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Sports Team', icon: '⚡', desc: 'Competing athlete in athletic & indoor ties' },
                  { id: 'Cultural Team', icon: '🎭', desc: 'Garba, music, drama & stage performances' },
                  { id: 'Visitor', icon: '🎟️', desc: 'Student supporter, spectator & resident pass' },
                ].map(r => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => {
                      setFormData({ ...formData, role: r.id, sports: [] });
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      formData.role === r.id
                        ? 'bg-gradient-to-br from-marigold/20 to-saffron/20 border-amber-400 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-ink-muted hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{r.icon}</span>
                      <span className="font-display text-base tracking-wide text-white">{r.id}</span>
                    </div>
                    <p className="text-[10px] text-ink-muted mt-1 leading-normal">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sports Team Section */}
            {formData.role === 'Sports Team' && (
              <div className="space-y-6 pt-2">
                
                {/* Kit Sizes */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* T-Shirt Size */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1.5">
                      Official Tournament T-Shirt Size *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TSHIRT_SIZES.map(size => (
                        <button
                          type="button"
                          key={size}
                          onClick={() => setFormData({ ...formData, tshirtSize: size })}
                          className={`w-10 h-10 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                            formData.tshirtSize === size
                              ? 'bg-saffron text-black border-saffron shadow font-extrabold'
                              : 'border-white/10 bg-white/5 text-ink-muted hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pant Size */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1.5">
                      Track Pant Waist Size (Inches) *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PANT_SIZES.map(size => (
                        <button
                          type="button"
                          key={size}
                          onClick={() => setFormData({ ...formData, pantSize: size })}
                          className={`w-10 h-10 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                            formData.pantSize === size
                              ? 'bg-saffron text-black border-saffron shadow font-extrabold'
                              : 'border-white/10 bg-white/5 text-ink-muted hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Male Player Sports Selection */}
                {formData.gender === 'Male' && (
                  <div className="space-y-5">
                    {/* Rule Info Banner */}
                    <div className={`p-4 rounded-2xl border transition-all ${
                      isRuleValid 
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200' 
                        : 'border-amber-400/40 bg-amber-400/10 text-amber-200'
                    }`}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-bold text-xs flex items-center gap-1.5">
                          <span>{isRuleValid ? '✓' : '⚠️'}</span>
                          <span>Male Player Sports Quota Rule:</span>
                        </span>
                        <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-black/40">
                          Selected: {outdoorSelected.length} Outdoor · {indoorSelected.length} Indoor (Total: {formData.sports.length}/3)
                        </span>
                      </div>
                      <p className="text-[11px] mt-1 text-ink-sub leading-normal">
                        A player can choose <strong>either 2 Outdoor + 1 Indoor sports</strong>, or <strong>1 Outdoor + 2 Indoor sports</strong> (Total exactly 3 sports).
                      </p>
                      {isRuleValid ? (
                        <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                          <span>✓</span> Valid selection confirmed: {outdoorSelected.length} Outdoor + {indoorSelected.length} Indoor sports.
                        </p>
                      ) : (
                        <p className="text-xs font-bold text-amber-300 mt-1">
                          • Current status: Please select {3 - formData.sports.length} more sport(s) following the 2+1 or 1+2 rule.
                        </p>
                      )}
                    </div>

                    {/* Outdoor Sports Grid */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-saffron flex items-center gap-1">
                          <span>🏟️</span> Outdoor Sports ({outdoorSelected.length}/2 selected)
                        </span>
                        <span className="text-[10px] text-ink-muted uppercase">Main Grounds</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {MALE_OUTDOOR_SPORTS.map(sport => {
                          const isSelected = formData.sports.includes(sport);
                          return (
                            <button
                              type="button"
                              key={sport}
                              onClick={() => toggleSport(sport, 'outdoor')}
                              className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-marigold text-black border-amber-300 shadow-md font-bold'
                                  : 'bg-white/5 border-white/10 text-ink-muted hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🏏</span>
                                <span className="text-xs font-bold uppercase">{sport}</span>
                              </div>
                              <span className="text-sm font-bold">{isSelected ? '✓' : '+'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Indoor Sports Grid */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                          <span>🏸</span> Indoor Sports ({indoorSelected.length}/2 selected)
                        </span>
                        <span className="text-[10px] text-ink-muted uppercase">Indoor Hall & Chess Room</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                        {MALE_INDOOR_SPORTS.map(sport => {
                          const isSelected = formData.sports.includes(sport);
                          return (
                            <button
                              type="button"
                              key={sport}
                              onClick={() => toggleSport(sport, 'indoor')}
                              className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-amber-400 text-black border-amber-300 shadow-md font-bold'
                                  : 'bg-white/5 border-white/10 text-ink-muted hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <span className="text-xs font-bold uppercase truncate">{sport}</span>
                              <span className="text-xs font-bold ml-1">{isSelected ? '✓' : '+'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* Female Player Sports Selection */}
                {formData.gender === 'Female' && (
                  <div className="space-y-5">
                    
                    {/* Outdoor Sports Notice for Female Students */}
                    <div className="p-5 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-saffron/10 to-orange-500/10 space-y-2">
                      <div className="flex items-center gap-2 text-saffron">
                        <span className="text-xl">📢</span>
                        <span className="font-display text-lg uppercase tracking-wider text-amber-300">
                          Outdoor Sports for Female Students
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        Coming soon, we will decide that afterwards.
                      </p>
                      <p className="text-xs text-ink-muted">
                        The women's outdoor athletics and field events committee is finalizing event formats and grounds. You can register for indoor disciplines right now.
                      </p>
                    </div>

                    {/* Indoor Sports for Female Students */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                        Indoor Sports Available for Registration:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                        {MALE_INDOOR_SPORTS.map(sport => {
                          const isSelected = formData.sports.includes(sport);
                          return (
                            <button
                              type="button"
                              key={sport}
                              onClick={() => toggleSport(sport, 'indoor')}
                              className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-amber-400 text-black border-amber-300 shadow-md font-bold'
                                  : 'bg-white/5 border-white/10 text-ink-muted hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <span className="text-xs font-bold uppercase truncate">{sport}</span>
                              <span className="text-xs font-bold">{isSelected ? '✓' : '+'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* Cultural Team Note */}
            {formData.role === 'Cultural Team' && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-marigold block">
                  Cultural Competitions & Showcase
                </span>
                <p className="text-xs text-ink-sub">
                  Represent your hostel in Garba Raas, vocal music, drama, skit, debate, or traditional arts. Auditions take place on Day 2 & 3.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Garba & Raas', 'Vocal Music', 'Drama / Skit', 'Debate & Elocution', 'Fine Arts'].map(act => (
                    <span key={act} className="text-xs font-bold px-3 py-1 rounded-xl bg-saffron/20 border border-saffron/30 text-amber-200">
                      ✓ {act}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Visitor Note */}
            {formData.role === 'Visitor' && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-marigold block">
                  Official Visitor Accreditation Pass
                </span>
                <p className="text-xs text-ink-sub">
                  Full campus spectator pass with access to match viewing galleries, cultural night celebrations, and designated mess dining sessions.
                </p>
              </div>
            )}

            {/* Terms & Conditions Acceptance */}
            <div className="pt-2 border-t border-white/10">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.acceptedTerms}
                  onChange={e => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                  className="mt-1 rounded text-saffron focus:ring-saffron"
                />
                <span className="text-xs text-ink-sub leading-snug">
                  I agree to tournament sportsmanship regulations and verify that all information provided is accurate. I authorize saving my credentials securely in this browser for auto-login.
                </span>
              </label>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-bold uppercase text-ink-muted hover:text-white"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl font-display text-base uppercase tracking-wider text-black bg-gradient-to-r from-marigold via-amber-400 to-saffron hover:from-amber-300 hover:to-orange-500 shadow-xl shadow-amber-500/25 hover:scale-102 active:scale-98 transition-all cursor-pointer"
              >
                Complete Registration & Generate ID Pass 🏆
              </button>
            </div>

          </div>
        </form>
      )}

      {/* ==================================================================== */}
      {/* STAGE 5: REGISTRATION COMPLETE WITH GENERATED QR CODE & ID PASS     */}
      {/* ==================================================================== */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in zoom-in-95 duration-200">
          <div className="p-6 sm:p-10 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#0E1433] via-[#0E1433]/90 to-[#070B1E] backdrop-blur-2xl shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
            
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-black flex items-center justify-center mx-auto shadow-xl">
              <span className="text-3xl">✓</span>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                Official Accreditation Confirmed
              </span>
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-white">
                Registration Successful!
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
                Welcome, <strong className="text-white">{formData.name} {formData.surname}</strong>! Your official digital tournament ID pass with scannable QR Code has been generated.
              </p>
            </div>

            {/* Cookie Auto-Login Confirmation Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-200 flex items-center justify-center gap-2">
              <span>🍪</span>
              <span>
                <strong>Login Saved in Browser:</strong> You will remain automatically logged in on this device.
              </span>
            </div>

            {/* Generated QR Pass Preview Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#141B44] to-[#0A0E23] border border-amber-400/30 max-w-sm mx-auto shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="font-display text-lg text-white block">INTER SMJV 2026</span>
                  <span className="text-[10px] text-amber-300 font-mono">GR: {formData.grNo}</span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-saffron text-black font-mono">
                  {formData.role}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white p-1.5 shadow-md flex-shrink-0">
                  <QRCodeView value={qrString} size={54} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-display text-lg text-white truncate">
                    {formData.name} {formData.surname}
                  </h4>
                  <p className="text-xs text-ink-muted truncate">{formData.branch}</p>
                  <p className="text-[10px] text-amber-300 font-mono mt-0.5">
                    {formData.sports.length > 0 ? formData.sports.join(', ') : formData.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenIdCard}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-marigold to-saffron shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>🪪 View Official ID Card</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-white border border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2"
              >
                <span>🖨️ Print Pass</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('dashboard')}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-ink-sub hover:text-white"
              >
                Go to Dashboard →
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
