import React from 'react';
import clsx from 'clsx';
import './text.css';

type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
type Weight = 'regular' | 'medium' | 'bold';

type TextProps = {
  variant?: Variant; // Visual style (size and hierarchy)
  weight?: Weight; // Font weight
  as?: React.ElementType; // HTML element to render (e.g. 'p', 'span', 'h1')
  children: React.ReactNode; // Text content
  className?: string; // Extra CSS classes
};

// Base text component
export const Text = ({
  variant = 'body',
  weight = 'regular',
  as: Component = 'p',
  children,
  className,
}: TextProps) => {
  return (
    <Component
      className={clsx('text', `text--${variant}`, `text--${weight}`, className)}
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
