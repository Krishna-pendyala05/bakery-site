import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

export interface User {
  id: number;
  mobile: string;
  name?: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  sendOtp: (mobile: string) => Promise<boolean>;
  verifyOtp: (mobile: string, otp: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load user on mount if token exists
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (err) {
        console.error('Session validation failed:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const sendOtp = async (mobile: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/send-otp', { mobile });
      setOtpSent(true);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check the number.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (mobile: string, otp: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/verify-otp', { mobile, otp });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setOtpSent(false);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        otpSent,
        sendOtp,
        verifyOtp,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
