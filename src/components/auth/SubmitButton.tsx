import { ArrowRight } from 'lucide-react';

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export default function SubmitButton({
  label,
  loadingLabel,
  isLoading,
  disabled = false,
  onClick,
  type = 'submit'
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className="w-full px-6 py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-base
        hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        inline-flex items-center justify-center gap-2 group"
    >
      {isLoading ? (
        <>
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {loadingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}
