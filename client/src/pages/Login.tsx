import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Phone, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { sendOtp, verifyOtp, loading, error, otpSent, clearError } = useAuth();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    // Simple mobile validation (+ or digits, min 10 digits)
    const cleanedMobile = mobile.trim();
    if (!/^\+?[1-9]\d{1,14}$/.test(cleanedMobile.replace(/[\s-()]/g, ''))) {
      setFormError('Please enter a valid mobile number (e.g. +919999999999)');
      return;
    }

    const success = await sendOtp(cleanedMobile);
    if (!success) {
      // Failed to send OTP
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (otp.length < 4) {
      setFormError('OTP must be at least 4 digits.');
      return;
    }

    const success = await verifyOtp(mobile, otp);
    if (success) {
      onLoginSuccess();
    }
  };

  return (
    <div style={{
      maxWidth: '440px',
      margin: '4rem auto',
      padding: '2.5rem',
      borderRadius: 'var(--radius-lg)',
    }} className="glass-card">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          backgroundColor: 'var(--secondary)',
          color: 'var(--primary)',
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <ShieldCheck size={28} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800 }}>
          {otpSent ? 'Enter Code' : 'Welcome Back'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          {otpSent 
            ? `We sent a 4-digit code to ${mobile}` 
            : 'Secure verification using your mobile number'}
        </p>
      </div>

      {/* Error Displays */}
      {(error || formError) && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: 'rgb(220, 38, 38)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{formError || error}</span>
        </div>
      )}

      {/* OTP Request Form */}
      {!otpSent ? (
        <form onSubmit={handleMobileSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="mobile">Mobile Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="mobile"
                type="tel"
                className="form-input"
                placeholder="+919999999999"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={loading}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Sending...' : 'Send OTP'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      ) : (
        /* OTP Verification Form */
        <form onSubmit={handleOtpSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="otp">One-Time Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="otp"
                type="text"
                maxLength={6}
                className="form-input"
                placeholder="1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                style={{ paddingLeft: '2.5rem', width: '100%', letterSpacing: '0.25em', fontWeight: 'bold' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Verifying...' : 'Verify & Log In'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              clearError();
              setFormError(null);
              // reset flow
              setMobile('');
              setOtp('');
              // To change number
              window.location.reload();
            }}
            style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.85rem' }}
          >
            Change Phone Number
          </button>
        </form>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>For testing, you can use: <b>+919999999999</b></p>
        <p style={{ marginTop: '0.25rem' }}>The default OTP code is <b>1234</b></p>
      </div>
    </div>
  );
};
