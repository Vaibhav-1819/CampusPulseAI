import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap'
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.4rem 0.85rem', fontSize: '0.85rem' },
    md: { padding: '0.7rem 1.4rem', fontSize: '0.95rem' },
    lg: { padding: '0.9rem 1.8rem', fontSize: '1.05rem' }
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.35)'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: 'var(--text-main)',
      border: '1px solid var(--card-border)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)'
    },
    danger: {
      background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.35)'
    }
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant]
      }}
      disabled={disabled || loading}
      className={`custom-button ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          style={{ animation: 'spin 1s linear infinite', width: 18, height: 18 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
};
