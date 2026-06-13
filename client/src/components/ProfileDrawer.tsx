import React, { useEffect, useRef } from 'react';
import { X, User, Phone, Mail, MapPin, LogOut, Edit2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onGoToOrders: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  onEditProfile,
  onGoToOrders,
}) => {
  const { user, logout } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Get initials from user name
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Parse address back to street + pincode
  const parseAddress = (address?: string) => {
    if (!address) return { street: '', pincode: '' };
    const match = address.match(/(.*),\s*Hyderabad\s*-\s*(\d{6})/);
    if (match) return { street: match[1], pincode: match[2] };
    return { street: address, pincode: '' };
  };

  const initials = getInitials(user?.name);
  const { street, pincode } = parseAddress(user?.address);

  // Close on Escape + body lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!user) return null;

  return (
    <>
      <style>{`
        /* ── Profile Backdrop ──────────────────────────────────── */
        .profile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 34, 41, 0.40);
          backdrop-filter: blur(4px);
          z-index: 999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 750ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .profile-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* ── Profile Drawer ────────────────────────────────────── */
        .profile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 38vw;
          min-width: 380px;
          max-width: 480px;
          background: #FFFFFF;
          box-shadow: -12px 0 40px rgba(0, 0, 0, 0.10);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 750ms cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
        }
        .profile-drawer.open {
          transform: translateX(0);
        }

        /* ── Header ─────────────────────────────────────────────── */
        .profile-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 32px 20px;
          border-bottom: 1px solid rgba(26,26,26,0.08);
        }
        .profile-drawer-title {
          font-family: var(--font-logo);
          font-size: 1.4rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-ink);
        }
        .profile-drawer-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: none;
          border: none;
          color: var(--color-ink);
          cursor: pointer;
          transition: background 0.2s;
        }
        .profile-drawer-close:hover {
          background: rgba(26,26,26,0.06);
        }
        .profile-drawer-close svg {
          width: 20px;
          height: 20px;
        }

        /* ── Hero Avatar Block ───────────────────────────────────── */
        .profile-drawer-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 36px 32px 28px;
          background: linear-gradient(160deg, #FAF9F5 0%, #FFFEF9 100%);
          border-bottom: 1px solid rgba(26,26,26,0.06);
        }
        .profile-avatar-large {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: var(--nav-bg, #E8D96B);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-logo);
          font-size: 2.2rem;
          letter-spacing: 0.04em;
          color: var(--color-ink);
          border: 3px solid var(--color-ink);
          position: relative;
          overflow: hidden;
          margin-bottom: 16px;
          animation: profile-avatar-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes profile-avatar-pop {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        /* Shimmer ring animation */
        .profile-avatar-large::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2.5px solid transparent;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            var(--color-ink) 60deg,
            transparent 120deg,
            transparent 360deg
          ) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          animation: profile-ring-spin 3s linear infinite;
          opacity: 0.35;
        }
        @keyframes profile-ring-spin {
          to { transform: rotate(360deg); }
        }
        .profile-drawer-name {
          font-family: var(--font-logo);
          font-size: 1.5rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--color-ink);
          margin-bottom: 4px;
          text-align: center;
        }
        .profile-drawer-member {
          font-family: var(--font-upright, 'Cormorant Upright', serif);
          font-size: 0.9rem;
          font-style: italic;
          color: var(--color-ink-muted, #7A7A6E);
          letter-spacing: 0.02em;
        }

        /* ── Info rows ───────────────────────────────────────────── */
        .profile-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .profile-drawer-body::-webkit-scrollbar { width: 4px; }
        .profile-drawer-body::-webkit-scrollbar-track { background: transparent; }
        .profile-drawer-body::-webkit-scrollbar-thumb { background: rgba(26,26,26,0.15); border-radius: 2px; }

        .profile-info-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(26,26,26,0.06);
        }
        .profile-info-row:last-child {
          border-bottom: none;
        }
        .profile-info-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(26,26,26,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .profile-info-icon svg {
          width: 17px;
          height: 17px;
          stroke: var(--color-ink);
          stroke-width: 1.6;
        }
        .profile-info-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .profile-info-label {
          font-family: var(--font-logo);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-ink-muted, #7A7A6E);
        }
        .profile-info-value {
          font-family: var(--font-logo);
          font-size: 1rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--color-ink);
          line-height: 1.3;
        }
        .profile-info-value.email-value {
          font-family: sans-serif;
          font-size: 0.92rem;
          text-transform: none;
          letter-spacing: normal;
        }

        /* ── Footer Actions ─────────────────────────────────────── */
        .profile-drawer-footer {
          padding: 20px 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid rgba(26,26,26,0.08);
        }
        .profile-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 13px 20px;
          border-radius: 12px;
          border: 2px solid var(--color-ink);
          font-family: var(--font-logo);
          font-size: 1rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .profile-action-btn svg {
          width: 17px;
          height: 17px;
          stroke-width: 1.8;
          flex-shrink: 0;
        }
        .profile-action-btn.primary {
          background: var(--color-ink);
          color: var(--color-brand, #E8D96B);
        }
        .profile-action-btn.primary:hover {
          background: #333;
          box-shadow: 3px 3px 0 var(--color-ink);
          transform: translate(-1px, -1px);
        }
        .profile-action-btn.secondary {
          background: #FFFFFF;
          color: var(--color-ink);
        }
        .profile-action-btn.secondary:hover {
          background: rgba(26,26,26,0.04);
          box-shadow: 3px 3px 0 var(--color-ink);
          transform: translate(-1px, -1px);
        }
        .profile-action-btn.danger {
          background: #FFFFFF;
          color: #C62828;
          border-color: #C62828;
        }
        .profile-action-btn.danger svg { stroke: #C62828; }
        .profile-action-btn.danger:hover {
          background: #FFF5F5;
          box-shadow: 3px 3px 0 #C62828;
          transform: translate(-1px, -1px);
        }
      `}</style>

      {/* Backdrop */}
      <div
        className={`profile-backdrop${isOpen ? ' open' : ''}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`profile-drawer${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="My Profile"
      >
        {/* Header */}
        <div className="profile-drawer-header">
          <span className="profile-drawer-title">My Profile</span>
          <button
            className="profile-drawer-close"
            onClick={onClose}
            aria-label="Close profile"
          >
            <X />
          </button>
        </div>

        {/* Hero Avatar Block */}
        <div className="profile-drawer-hero">
          <div className="profile-avatar-large">
            {initials}
          </div>
          <div className="profile-drawer-name">{user.name || 'Member'}</div>
          <div className="profile-drawer-member">L'Étoile Sucrée Member</div>
        </div>

        {/* Info rows */}
        <div className="profile-drawer-body">
          {user.mobile && (
            <div className="profile-info-row">
              <div className="profile-info-icon"><Phone /></div>
              <div className="profile-info-content">
                <span className="profile-info-label">Mobile</span>
                <span className="profile-info-value">{user.mobile.replace('+91', '+91 ')}</span>
              </div>
            </div>
          )}

          {user.email && (
            <div className="profile-info-row">
              <div className="profile-info-icon"><Mail /></div>
              <div className="profile-info-content">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value email-value">{user.email}</span>
              </div>
            </div>
          )}

          {street && (
            <div className="profile-info-row">
              <div className="profile-info-icon"><MapPin /></div>
              <div className="profile-info-content">
                <span className="profile-info-label">Delivery Address</span>
                <span className="profile-info-value">{street}</span>
                {pincode && (
                  <span className="profile-info-value" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    Hyderabad — {pincode}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="profile-drawer-footer">
          <button className="profile-action-btn secondary" onClick={() => { onEditProfile(); onClose(); }}>
            <Edit2 />
            Edit Profile
          </button>
          <button className="profile-action-btn primary" onClick={() => { onGoToOrders(); onClose(); }}>
            <ShoppingBag />
            My Orders
          </button>
          <button className="profile-action-btn danger" onClick={handleLogout}>
            <LogOut />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};
