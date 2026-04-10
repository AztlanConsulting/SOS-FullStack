import { twMerge } from 'tailwind-merge';
import type { ComponentType } from 'react';
import { Text } from '../Text';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'plans';
type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: ComponentType<{ size?: number }>;
};
export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  icon: Icon,
}: ButtonProps) {
  const base =
    'flex items-center justify-center gap-2 px-3 py-2 rounded-[20px] font-semibold text-base transition-colors duration-200';
  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-yellow-400 text-white hover:bg-yellow-500 w-5/6 md:w-5/6 lg:w-5/6 xl:w-5/6',
    secondary:
      'bg-white text-yellow-400 hover:bg-yellow-200 w-5/6 md:w-5/6 lg:w-5/6 xl:w-5/6 border-2 border-yellow-400',
    danger:
      'bg-[#F5F5F5] text-[#61646B] hover:bg-[#D3D3D3] w-5/6 md:w-5/6 lg:w-5/6 xl:w-5/6 border-2 border-[#61646B]',
    plans:
      'bg-yellow-400 text-black hover:bg-yellow-500 w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        base,
        variants[variant],
        'relative flex justify-center',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <div className="flex justify-center items-center">
        <Text variant="body" weight="medium" className="text-inherit">
          {label}
        </Text>

        {Icon && (
          <span className="absolute right-3 top-[52%] -translate-y-1/2">
            <Icon size={22} />
          </span>
        )}
      </div>
    </button>
  );
}
