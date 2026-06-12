import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

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

    const cleanedMobile = mobile.trim();
    if (!/^\+?[1-9]\d{1,14}$/.test(cleanedMobile.replace(/[\s\-()]/g, ''))) {
      setFormError('Please enter a valid mobile number (e.g. +919999999999)');
      return;
    }

    await sendOtp(cleanedMobile);
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
    <div>
      <h1>{otpSent ? 'Enter Code' : 'Welcome Back'}</h1>
      <p>
        {otpSent
          ? `We sent a code to ${mobile}`
          : 'Secure verification using your mobile number'}
      </p>

      {/* Error banner */}
      {(error || formError) && (
        <p role="alert">{formError || error}</p>
      )}

      {/* Step 1 — request OTP */}
      {!otpSent ? (
        <form onSubmit={handleMobileSubmit}>
          <label htmlFor="mobile">Mobile Number</label>
          <input
            id="mobile"
            type="tel"
            placeholder="+919999999999"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send OTP'}
          </button>
        </form>
      ) : (
        /* Step 2 — verify OTP */
        <form onSubmit={handleOtpSubmit}>
          <label htmlFor="otp">One-Time Password</label>
          <input
            id="otp"
            type="text"
            maxLength={6}
            placeholder="1234"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify & Log In'}
          </button>

          <button
            type="button"
            onClick={() => {
              clearError();
              setFormError(null);
              setMobile('');
              setOtp('');
              window.location.reload();
            }}
          >
            Change Phone Number
          </button>
        </form>
      )}

      <p>For testing use: <strong>+919999999999</strong> / OTP: <strong>1234</strong></p>
    </div>
  );
};
