import React from 'react';
import { twMerge } from 'tailwind-merge';

type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
type Weight = 'regular' | 'medium' | 'bold';

type TextProps = {
  variant?: Variant;
  weight?: Weight;
  color?: string; // 👈 cualquier clase Tailwind (ej: "text-red-500")
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
};

const variantStyles: Record<Variant, string> = {
  display: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight',
  h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight',
  h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug',
  h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug',
  body: 'text-sm sm:text-base md:text-lg leading-relaxed',
  caption: 'text-xs sm:text-sm leading-normal',
  small: 'text-xs leading-normal',
};

const weightStyles: Record<Weight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  bold: 'font-bold',
};

export const Text = ({
  variant = 'body',
  weight = 'regular',
  color,
  as: Component = 'p',
  children,
  className,
}: TextProps) => {
  const defaultColor = 'text-gray-900';

  return (
    <Component
      className={twMerge(
        variantStyles[variant],
        weightStyles[weight],
        color ?? defaultColor,
        className,
      )}
    >
      {children}
    </Component>
  );
};
/**
 * Example:
 * <Text
 *   variant="h1"
 *   weight="bold"
 *   as="h1"
 *   className="custom-class"
 * >
 *   Hello world
 * </Text>
 */
