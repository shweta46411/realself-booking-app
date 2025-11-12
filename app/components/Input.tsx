import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm sm:text-base font-semibold text-black mb-2">
            {label}
            {required && <span className="text-[#FF838A] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          required={required}
          aria-required={required}
          className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] text-sm sm:text-base ${
            error
              ? 'border-[#FF838A] focus:ring-[#FF838A]'
              : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm font-medium text-[#FF838A]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

