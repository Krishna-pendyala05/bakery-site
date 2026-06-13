import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginProps {
  onLoginSuccess: () => void;
}

const HYDERABAD_DELIVERY_PINCODES = [
  '500001', '500002', '500003', '500004', '500007', '500008', '500012', 
  '500013', '500016', '500018', '500020', '500024', '500025', '500027', 
  '500028', '500029', '500030', '500034', '500035', '500036', '500038', 
  '500041', '500044', '500045', '500048', '500053', '500057', '500059', 
  '500060', '500063', '500064', '500065', '500068', '500072', '500073',
  '500074', '500075', '500076', '500079', '500080', '500081', '500082',
  '500084', '500085', '500089', '500090', '500095', '500097'
];

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { sendOtp, verifyOtp, updateProfile, logout, loading, error, otpSent, user, clearError } = useAuth();
  
  // Tab control: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>(() => {
    const hash = window.location.hash;
    return hash === '#register' ? 'register' : 'login';
  });

  // Helper selectors for layout state
  const isProfileIncomplete = user && (!user.name || !user.email || !user.address);
  const showRegistrationForm = !!isProfileIncomplete || (user && isEditingProfile);
  const showProfileDashboard = user && !isProfileIncomplete && !isEditingProfile;
  const showOtpForm = otpSent && !user;
  const showMobileForm = !otpSent && !user;
  const isRegistering = showRegistrationForm || (authMode === 'register' && !user);

  // Sync URL hash with active registration/login mode changes
  useEffect(() => {
    const targetHash = isRegistering ? '#register' : '#login';
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [isRegistering]);

  // Sync authMode with hash changes (e.g. back/forward button)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#register') {
        setAuthMode('register');
      } else if (hash === '#login') {
        setAuthMode('login');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Form states
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  
  // Registration / Edit form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  
  // UI / Validation states
  const [formError, setFormError] = useState<string | null>(null);
  const [pincodeStatus, setPincodeStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Manage Resend OTP countdown timer
  useEffect(() => {
    if (otpSent) {
      setResendCountdown(30);
    }
  }, [otpSent]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || loading) return;
    setFormError(null);
    clearError();
    const fullMobileNumber = `+91${mobile.trim()}`;
    await sendOtp(fullMobileNumber);
    setResendCountdown(30); // Reset timer
  };

  // Clear errors on tab or mount change
  useEffect(() => {
    clearError();
    setFormError(null);
  }, [authMode]);

  // Sync profile details to form states (for editing or registration completion)
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      
      if (user.address) {
        // Parse "Street Address, Hyderabad - 500xxx" back into separate fields
        const match = user.address.match(/(.*),\s*Hyderabad\s*-\s*(\d{6})/);
        if (match) {
          setAddress(match[1]);
          setPincode(match[2]);
        } else {
          setAddress(user.address);
          setPincode('');
        }
      }
    }
  }, [user]);

  // If user is already logged in and registration is complete, proceed
  useEffect(() => {
    if (user && user.verified && user.name && user.email && user.address && !isEditingProfile) {
      onLoginSuccess();
    }
  }, [user, onLoginSuccess, isEditingProfile]);

  // Handle mobile submission
  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    const cleanedMobile = mobile.trim();
    if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
      setFormError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    const fullMobileNumber = `+91${cleanedMobile}`;
    await sendOtp(fullMobileNumber);
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (otp.length < 4) {
      setFormError('OTP code must be at least 4 digits');
      return;
    }

    const fullMobileNumber = `+91${mobile.trim()}`;
    await verifyOtp(fullMobileNumber, otp);
  };

  // Live pincode validation handler
  useEffect(() => {
    const cleanPin = pincode.trim();
    if (cleanPin.length === 0) {
      setPincodeStatus({ type: null, message: '' });
      return;
    }

    if (!/^\d+$/.test(cleanPin)) {
      setPincodeStatus({ type: 'error', message: 'Pincode must contain numbers only' });
      return;
    }

    if (cleanPin.length < 6) {
      setPincodeStatus({ type: null, message: '' });
      return;
    }

    if (cleanPin.length > 6) {
      setPincodeStatus({ type: 'error', message: 'Pincode must be exactly 6 digits' });
      return;
    }

    if (!cleanPin.startsWith('500') || !HYDERABAD_DELIVERY_PINCODES.includes(cleanPin)) {
      setPincodeStatus({
        type: 'error',
        message: '✗ We do not serve in this area'
      });
    } else {
      setPincodeStatus({
        type: 'success',
        message: '✓ Within our active Hyderabad delivery radius!'
      });
    }
  }, [pincode]);

  // Handle profile details registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!name.trim() || !email.trim() || !address.trim() || !pincode.trim()) {
      setFormError('Please complete all registration details');
      return;
    }

    if (pincodeStatus.type === 'error') {
      setFormError(pincodeStatus.message);
      return;
    }

    const success = await updateProfile({ name, email, address, pincode });
    if (success) {
      setIsEditingProfile(false);
      onLoginSuccess();
    }
  };

  // Determine active left panel background color (Rose terracotta for login, Indigo purple for register/edit)
  const leftPanelBg = isRegistering ? '#8B96F5' : '#A36D7B';
  const heartImgSrc = isRegistering ? '/purple-heart.png' : '/brown heart.png';
  const accentColor = isRegistering ? '#8B96F5' : '#A36D7B';
  const accentColorDark = isRegistering ? '#4E5AD2' : '#7B4A57';

  return (
    <div className="auth-page-container" style={{ 
      '--auth-accent': accentColor,
      '--auth-accent-dark': accentColorDark
    } as React.CSSProperties}>
      <style>{`
        /* ── Split Layout Container (Matches Custom Order Page) ── */
        .auth-page-container {
          display: flex;
          flex-direction: row;
          gap: 10px;
          background: var(--color-bg);
          width: 100%;
          height: calc(100vh - var(--nav-height));
          min-height: 600px;
          overflow: hidden;
          border-top: 10px solid var(--color-bg);
          border-bottom: 10px solid var(--color-bg);
          box-sizing: border-box;
          position: relative;
        }

        /* ── Left Quote Panel (Matches Custom Order Left Panel) ── */
        .auth-left {
          position: relative;
          flex: 0 0 calc(50% - 5px);
          min-width: 0;
          height: 100%;
          background: ${leftPanelBg};
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          border-radius: 0 50px 50px 0;
          transition: background 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          
          /* Outline borders on top, bottom, and right; no border on outer left edge */
          border-top: 2px solid var(--color-ink);
          border-bottom: 2px solid var(--color-ink);
          border-right: 2px solid var(--color-ink);
          border-left: none !important;
        }

        /* ── Right Form Panel (Matches Custom Order Right Panel) ── */
        .auth-right {
          position: relative;
          flex: 0 0 calc(50% - 5px);
          min-width: 0;
          height: 100%;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 24px 52px;
          z-index: 2;
          border-radius: 50px 0 0 50px;
          box-sizing: border-box;
          overflow-y: auto;

          /* Outline borders on top, bottom, and left; no border on outer right edge */
          border-top: 2px solid var(--color-ink);
          border-bottom: 2px solid var(--color-ink);
          border-left: 2px solid var(--color-ink);
          border-right: none !important;
        }

        /* Stage wrapper to center each view perfectly */
        .auth-stage-wrapper {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        /* Scrollbar styling for form panel */
        .auth-right::-webkit-scrollbar {
          width: 6px;
        }
        .auth-right::-webkit-scrollbar-track {
          background: transparent;
        }
        .auth-right::-webkit-scrollbar-thumb {
          background: rgba(122, 81, 69, 0.2);
          border-radius: 9999px;
        }
        .auth-right::-webkit-scrollbar-thumb:hover {
          background: rgba(122, 81, 69, 0.4);
        }

        /* ── Heart Boundary Badge ────────────────────────────── */
        .auth-heart {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: clamp(70px, 7.5vw, 105px);
          height: auto;
          z-index: 10;
          pointer-events: none;
          filter: drop-shadow(0px 6px 12px rgba(0,0,0,0.15));
        }
        .auth-heart img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* ── Quote Layout (Matches Custom Order Quotes) ───────── */
        .auth-quote {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 85%;
          max-width: 480px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .auth-quote-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15em;
        }
        .auth-line {
          position: relative;
          display: block;
          width: fit-content;
          white-space: nowrap;
        }
        .auth-line span {
          font-family: var(--font-logo);
          font-size: clamp(38px, 5.2vw, 64px);
          font-weight: 400;
          text-transform: uppercase;
          color: var(--color-bg);
          -webkit-text-stroke: 1.5px var(--color-ink);
          text-shadow: 3px 3px 0 var(--color-ink);
          line-height: 0.95;
          letter-spacing: 0.02em;
          display: block;
        }
        .auth-quote-open {
          position: absolute;
          right: 100%;
          bottom: calc(100% - 0.22em);
          margin-right: 10px;
          width: clamp(28px, 3.5vw, 52px);
          height: auto;
          display: block;
        }
        .auth-quote-close {
          position: absolute;
          left: 100%;
          top: calc(100% - 0.22em);
          margin-left: 10px;
          width: clamp(28px, 3.5vw, 52px);
          height: auto;
          display: block;
        }

        /* ── Tabs Selector (Pill Toggle style) ───────────────── */
        .auth-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
          max-width: 400px;
          width: 100%;
          box-sizing: border-box;
        }
        .auth-tab-btn {
          font-family: var(--font-logo);
          font-size: 1.05rem;
          width: 125px;
          text-align: center;
          padding: 8px 0;
          border-radius: 9999px;
          border: 2px solid var(--color-ink);
          background: #FFFFFF;
          color: var(--color-ink);
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box;
          display: inline-block;
        }
        .auth-tab-btn:hover {
          transform: translateY(-1px);
        }
        .auth-tab-btn.active {
          background: var(--auth-accent-dark);
          color: #FFFFFF;
          border-color: var(--color-ink);
          box-shadow: 3px 3px 0 var(--color-ink);
        }

        /* ── Typography & Headings (Right Panel) ──────────────── */
        .auth-right-header {
          text-align: center;
          margin-bottom: 12px;
        }
        .auth-logo-brand {
          font-family: var(--font-logo);
          font-size: 30px;
          color: var(--color-ink);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }
        .auth-right-title {
          font-family: var(--font-logo);
          font-size: 20px;
          font-weight: 400;
          color: var(--auth-accent-dark);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .auth-divider {
          width: 50px;
          height: 3px;
          background: var(--auth-accent-dark);
          margin: 6px auto;
          border-radius: 9999px;
        }
        .auth-subtitle {
          font-family: var(--font-upright);
          font-size: 0.95rem;
          font-style: italic;
          color: var(--color-ink);
          line-height: 1.35;
          max-width: 380px;
          margin: 0 auto;
        }

        /* ── Form Controls (Matches Custom Order Fields) ─────── */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .auth-label {
          font-family: var(--font-logo);
          font-size: 1.15rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: var(--color-ink);
          display: block;
        }

        /* Tel Input Row */
        .auth-tel-wrapper {
          display: flex;
          gap: 10px;
        }
        .auth-tel-prefix {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          border: 2px solid var(--color-ink);
          border-radius: 12px;
          width: 65px;
          font-family: var(--font-logo);
          font-size: 1.05rem;
          color: var(--color-ink);
          letter-spacing: 0.02em;
        }

        .auth-input {
          font-family: var(--font-logo);
          font-size: 1.05rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          padding: 10px 12px;
          border: 2px solid var(--color-ink);
          border-radius: 12px;
          background: #FFFFFF;
          color: var(--color-ink);
          width: 100%;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .auth-input::placeholder {
          color: rgba(26, 26, 26, 0.45);
          font-family: var(--font-logo);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .auth-input:focus {
          outline: none;
          box-shadow: 3px 3px 0 var(--color-ink);
          transform: translate(-1px, -1px);
        }
        .auth-input:disabled {
          background: rgba(26, 26, 26, 0.05);
          cursor: not-allowed;
        }

        /* Email Specific styling to distinguish cases */
        .auth-input-email {
          font-family: sans-serif !important;
          font-size: 0.95rem !important;
          font-weight: 500 !important;
          text-transform: none !important;
          letter-spacing: normal !important;
        }
        .auth-input-email::placeholder {
          font-family: sans-serif !important;
          font-size: 0.95rem !important;
          text-transform: none !important;
          letter-spacing: normal !important;
        }        /* ── Location Validation Message ─────────────────────── */
        .auth-pincode-box {
          position: relative;
        }
        .auth-pincode-status {
          font-family: var(--font-logo);
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin-top: 6px;
        }
        .auth-pincode-status.success {
          color: #2E7D32;
        }
        .auth-pincode-status.error {
          color: #C62828;
        }

        /* ── Buttons (Matches Hero CTA style) ────────────────── */
        .auth-btn-primary {
          font-family: var(--font-logo);
          font-size: 1.15rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 2px solid var(--color-ink);
          padding: 11px 24px;
          cursor: pointer;
          white-space: nowrap;
          transition: background var(--transition-fast), color var(--transition-fast), transform 0.15s, box-shadow 0.15s;
          box-shadow: 3px 3px 0 var(--color-ink);
          background: var(--color-ink);
          color: var(--color-bg);
          border-radius: 0 20px 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
        }
        .auth-btn-primary:hover:not(:disabled) {
          background: var(--auth-accent);
          color: #FFFFFF;
        }
        .auth-btn-primary:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 var(--color-ink);
        }
        .auth-btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-btn-secondary {
          font-family: var(--font-logo);
          font-size: 1.15rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 2px solid var(--color-ink);
          padding: 10px 24px;
          cursor: pointer;
          white-space: nowrap;
          transition: background var(--transition-fast), color var(--transition-fast), transform 0.15s, box-shadow 0.15s;
          box-shadow: 3px 3px 0 var(--color-ink);
          background: #FFFFFF;
          color: var(--color-ink);
          border-radius: 20px 0 20px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .auth-btn-secondary:hover {
          background: var(--color-ink);
          color: #FFFFFF;
        }
        .auth-btn-secondary:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 var(--color-ink);
        }

        .auth-links-row {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 18px;
          gap: 20px;
          max-width: 400px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        }

        .auth-resend-btn {
          background: none;
          border: none;
          font-family: var(--font-logo);
          font-size: 0.95rem;
          color: var(--color-ink);
          text-decoration: underline;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          margin: 0;
          padding: 0;
          transition: color 0.2s ease;
        }
        .auth-resend-btn:disabled {
          color: var(--color-ink-muted);
          text-decoration: none;
          cursor: not-allowed;
          opacity: 0.6;
        }
        .auth-resend-btn:hover:not(:disabled) {
          color: var(--auth-accent-dark);
        }

        .auth-btn-back {
          background: none;
          border: none;
          font-family: var(--font-logo);
          font-size: 0.95rem;
          color: var(--auth-accent-dark);
          text-decoration: underline;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          margin: 0;
          padding: 0;
          transition: color 0.2s ease;
        }
        .auth-btn-back:hover {
          color: var(--color-ink);
        }

        /* ── Alert Banner (Matches Custom Order Warning) ─────── */
        .auth-error-banner {
          background: #FFF0F0;
          border: 2px solid #D32F2F;
          color: #D32F2F;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-family: var(--font-logo);
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          box-shadow: 3px 3px 0 var(--color-ink);
          animation: errorShake 0.3s ease;
          max-width: 400px;
          width: 100%;
          box-sizing: border-box;
        }
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        /* ── Info Box (Hyderabad Zone info) ──────────────────── */
        .auth-info-card {
          background: #FFF8FA;
          border: 2px solid var(--color-ink);
          border-radius: 12px;
          padding: 10px 12px;
          margin-top: 8px;
          box-sizing: border-box;
          box-shadow: 3px 3px 0 var(--color-ink);
        }
        .auth-info-title {
          font-family: var(--font-logo);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--auth-accent-dark);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .auth-info-desc {
          font-family: var(--font-upright);
          font-size: 0.85rem;
          font-style: italic;
          color: var(--color-ink);
          line-height: 1.35;
        }

        /* ── Mock Test Credentials Helper ───────────────────── */
        .auth-test-helper {
          background: #FAF9F5;
          border: 2px dashed var(--color-ink-muted);
          border-radius: 12px;
          padding: 12px;
          margin: 24px auto 0 auto;
          font-family: sans-serif;
          font-size: 0.85rem;
          color: var(--color-ink);
          line-height: 1.4;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          max-width: 400px;
          width: 100%;
          box-sizing: border-box;
        }
        .auth-test-helper strong {
          color: var(--auth-accent-dark);
          font-weight: 700;
        }

        /* ── Profile Dashboard View ──────────────────────────── */
        .profile-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .profile-details-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #FAF9F5;
          border: 2px solid var(--color-ink);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 3px 3px 0 var(--color-ink);
        }
        .profile-detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .profile-detail-label {
          font-family: var(--font-logo);
          font-size: 1.05rem;
          text-transform: uppercase;
          color: var(--auth-accent);
        }
        .profile-detail-val {
          font-family: var(--font-logo);
          font-size: 1.35rem;
          color: var(--color-ink);
          word-break: break-word;
          text-transform: uppercase;
        }
        /* Specific override for email uppercase font in profile list */
        .profile-detail-email {
          font-family: sans-serif !important;
          font-size: 1.05rem !important;
          text-transform: none !important;
        }
        .profile-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 10px;
        }
        .profile-verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(46, 125, 50, 0.08);
          color: #2E7D32;
          font-family: var(--font-logo);
          font-size: 1.05rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 12px;
          border: 2px solid #2E7D32;
          border-radius: var(--radius-full);
          align-self: flex-start;
          margin-top: 4px;
        }

        /* ── Mobile Layout Adjustments ──────────────────────── */
        @media (max-width: 800px) {
          .auth-page-container {
            flex-direction: column;
            height: auto;
            min-height: initial;
            gap: 10px;
          }
          .auth-left {
            width: 100%;
            height: 200px;
            border-radius: 0 0 35px 35px;
            border-left: none !important;
            border-right: none !important;
          }
          .auth-right {
            width: 100%;
            height: auto;
            border-radius: 35px 35px 0 0;
            padding: 32px 20px;
            border-left: none !important;
            border-right: none !important;
            border-top: 2px solid var(--color-ink);
          }
        }
      `}</style>

      {/* Left Column: Welcome Quote Banner */}
      <div className="auth-left">
        <div className="auth-quote">
          <div className="auth-quote-content">
            <div className="auth-line">
              <img src="/quote 1st.png" className="auth-quote-open" alt="" />
              <span>
                {showProfileDashboard 
                  ? 'WELCOME BACK,' 
                  : showRegistrationForm 
                    ? 'BECOME A' 
                    : authMode === 'login' 
                      ? 'WELCOME BACK,' 
                      : 'JOIN OUR'}
              </span>
            </div>
            <div className="auth-line">
              <span>
                {showProfileDashboard 
                  ? 'DEAR PATRON' 
                  : showRegistrationForm 
                    ? 'DEAR PATRON' 
                    : authMode === 'login' 
                      ? 'DEAR PATRON' 
                      : 'SWEET JOURNEY'}
              </span>
              <img src="/quote 2nd.png" className="auth-quote-close" alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative center heart badge (floating on boundary between panels) */}
      <div className="auth-heart">
        <img src={heartImgSrc} alt="" aria-hidden="true" />
      </div>

      {/* Right Column: Dynamic Form Section */}
      <div className="auth-right">
        {/* Banner Alert for Server-side or Validation Errors */}
        {(error || formError) && (
          <div className="auth-error-banner" role="alert">
            {formError || error}
          </div>
        )}

        {/* Tab Selection (Only shown when user is not logged in / verifying) */}
        {!user && !otpSent && (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>
        )}

        {/* ── STAGE 1: Enter Mobile Number ── */}
        {showMobileForm && (
          <div className="auth-stage-wrapper">
            <div className="auth-right-header">
              <h2 className="auth-logo-brand">L'Étoile Sucrée</h2>
              <h3 className="auth-right-title">
                {authMode === 'login' ? 'Patron Login' : 'Patron Registration'}
              </h3>
              <div className="auth-divider"></div>
              <p className="auth-subtitle">
                {authMode === 'login' 
                  ? 'Enter your mobile number to log in to your account'
                  : 'Enter your mobile number to register and claim your sweet spot'
                }
              </p>
            </div>

            <form onSubmit={handleMobileSubmit} className="auth-form">
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="mobile">Mobile Number</label>
                <div className="auth-tel-wrapper">
                  <div className="auth-tel-prefix">+91</div>
                  <input
                    id="mobile"
                    type="tel"
                    className="auth-input"
                    placeholder="9999999999"
                    maxLength={10}
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    disabled={loading}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? 'Sending Code...' : 'Send OTP'}
              </button>
            </form>

            <div className="auth-test-helper">
              For testing use: <strong>9999999999</strong> (OTP will be <strong>1234</strong>)
            </div>
          </div>
        )}

        {/* ── STAGE 2: OTP Verification ── */}
        {showOtpForm && (
          <div className="auth-stage-wrapper">
            <div className="auth-right-header">
              <h2 className="auth-logo-brand">L'Étoile Sucrée</h2>
              <h3 className="auth-right-title">Verify Code</h3>
              <div className="auth-divider"></div>
              <p className="auth-subtitle">
                We sent a 4-digit code to +91 {mobile}. Please enter it below.
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="auth-form">
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="otp">One-Time Password</label>
                <input
                  id="otp"
                  type="text"
                  className="auth-input"
                  maxLength={6}
                  placeholder="1234"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={loading}
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? 'Verifying Code...' : 'Verify OTP'}
              </button>

              <div className="auth-links-row">
                <button
                  type="button"
                  className="auth-resend-btn"
                  onClick={handleResendOtp}
                  disabled={resendCountdown > 0 || loading}
                >
                  {resendCountdown > 0 ? `Resend OTP (${resendCountdown}s)` : 'Resend OTP'}
                </button>

                <button
                  type="button"
                  className="auth-btn-back"
                  onClick={() => {
                    clearError();
                    setFormError(null);
                    setOtp('');
                    window.location.reload();
                  }}
                >
                  Change Phone Number
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── STAGE 3: Registration Profile Details ── */}
        {showRegistrationForm && (
          <div className="auth-stage-wrapper">
            <div className="auth-right-header">
              <h3 className="auth-right-title">{isEditingProfile ? 'Edit Profile' : 'Complete Profile'}</h3>
              <div className="auth-divider"></div>
              <p className="auth-subtitle">
                Please complete your details to register and verify delivery area limits
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="auth-form">
              {/* Full Name */}
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="auth-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={loading}
                  required
                  autoFocus
                />
              </div>

              {/* Email ID */}
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="auth-input auth-input-email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Street Address */}
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="address">Street Address</label>
                <input
                  id="address"
                  type="text"
                  className="auth-input"
                  placeholder="Flat No, Apartment, Road Name"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Pincode & Locality check */}
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="pincode">Pincode</label>
                <div className="auth-pincode-box">
                  <input
                    id="pincode"
                    type="text"
                    className="auth-input"
                    maxLength={6}
                    placeholder="500034"
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                    disabled={loading}
                    required
                  />
                  {pincodeStatus.message && (
                    <div className={`auth-pincode-status ${pincodeStatus.type || ''}`}>
                      {pincodeStatus.message}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={loading || pincodeStatus.type === 'error'}
              >
                {loading ? 'Saving Details...' : isEditingProfile ? 'Save Profile' : 'Complete Registration'}
              </button>

              {isEditingProfile ? (
                <button
                  type="button"
                  className="auth-btn-back"
                  onClick={() => {
                    clearError();
                    setFormError(null);
                    setIsEditingProfile(false);
                  }}
                >
                  Cancel Editing
                </button>
              ) : (
                <button
                  type="button"
                  className="auth-btn-back"
                  onClick={() => {
                    logout();
                    clearError();
                    setFormError(null);
                  }}
                >
                  Cancel & Log Out
                </button>
              )}
            </form>
          </div>
        )}

        {/* ── STAGE 4: Profile Dashboard (Logged in) ── */}
        {showProfileDashboard && user && (
          <div className="profile-dashboard">
            <div className="auth-right-header">
              <h3 className="auth-right-title">My Profile</h3>
              <div className="auth-divider"></div>
              <p className="auth-subtitle">
                Welcome back, {user.name}! Your account is fully active.
              </p>
              <div className="profile-verified-badge">
                ✓ Account Verified
              </div>
            </div>

            <div className="profile-details-list">
              <div className="profile-detail-item">
                <span className="profile-detail-label">Full Name</span>
                <span className="profile-detail-val">{user.name}</span>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">Mobile Number</span>
                <span className="profile-detail-val">{user.mobile}</span>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">Email ID</span>
                <span className="profile-detail-val profile-detail-email">{user.email}</span>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">Delivery Address</span>
                <span className="profile-detail-val">{user.address}</span>
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="auth-btn-secondary"
                onClick={() => setIsEditingProfile(true)}
              >
                Edit Profile
              </button>
              
              <button
                className="auth-btn-primary"
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
