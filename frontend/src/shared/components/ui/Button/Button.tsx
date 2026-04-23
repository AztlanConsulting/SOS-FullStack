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
  textColor?: string;
  type?: 'button' | 'submit' | 'reset';
};
export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  icon: Icon,
  textColor = '',
  type = 'button',
}: ButtonProps) {
  const base =
    'flex items-center justify-center gap-2 px-3 py-2 rounded-c font-semibold text-base transition-colors duration-200';
  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-yellow-400 text-white hover:bg-yellow-500 w-5/6 md:w-5/6 lg:w-5/6 xl:w-5/6',
    secondary:
      'bg-white text-yellow-400 hover:bg-yellow-200 w-5/6 md:w-5/6 lg:w-5/6 xl:w-5/6 border-2 border-yellow-400',
    danger:
      'bg-[#F5F5F5] text-[#61646B] hover:bg-[#D3D3D3] w-full md:w-auto lg:w-full xl:w-full border-1 border-[#61646B]',
    plans:
      'bg-yellow-400 text-black hover:bg-yellow-500 w-3/7 md:w-3/7 lg:w-3/7 xl:w-3/7',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={twMerge(
        base,
        variants[variant],
        'relative flex justify-center',
        disabled && 'opacity-50 cursor-not-allowed',
        textColor,
      )}
    >
      <div
        className={`flex justify-${Icon ? 'between' : 'center'} items-center w-full cursor-pointer`}
      >
        {Icon ? <div className="w-[33px]" /> : <></>}

        <Text variant="caption" weight="medium" className="text-inherit">
          {label}
        </Text>

        {Icon && (
          <span className="flex items-center justify-start w-[33px]">
            <Icon size={17} />
          </span>
        )}
      </div>
    </button>
  );
}
