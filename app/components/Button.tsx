import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base';
  
  const styles = variant === 'primary'
    ? 'bg-[#FF6B35] text-white hover:bg-[#FF5722] focus:ring-[#FF6B35]'
    : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white focus:ring-black';

  return (
    <button
      className={`${base} ${styles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}

