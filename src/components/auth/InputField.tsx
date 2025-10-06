import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface InputFieldProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}

export default function InputField({
  id,
  label,
  type,
  placeholder,
  icon: Icon,
  value,
  onChange,
  error,
  required = false,
  autoComplete
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-11 ${type === 'password' ? 'pr-12' : 'pr-4'} py-3 border-2 rounded-xl
            transition-all duration-200 text-slate-900 text-base
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'}
            focus:ring-2 focus:outline-none placeholder:text-slate-400`}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" className="text-red-500 text-sm mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
}
