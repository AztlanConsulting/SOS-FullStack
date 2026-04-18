import React from 'react';
import { twMerge } from 'tailwind-merge';

type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

type TextProps = {
  variant?: Variant;
  weight?: Weight;
  color?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
};

const variantStyles: Record<Variant, string> = {
  display: 'text-3xl lg:text-5xl leading-tight',
  h1: 'text-2xl lg:text-3xl leading-tight',
  h2: 'text-xl lg:text-2xl font-semibold leading-snug',
  h3: 'text-lg lg:text-xl font-semibold leading-snug',
  body: 'text-base leading-relaxed',
  caption: 'text-sm leading-normal',
  small: 'text-xs leading-normal',
};

const weightStyles: Record<Weight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
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
        color || defaultColor,
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
