import React from 'react';
import { createPortal } from 'react-dom';
import { Text } from '../Text';
import { Button } from '@/shared/components/ui/Button/Button';

/**
 * Configuration properties for the DecisionModal component.
 */
type DecisionModalProps = {
  title: string;
  description?: string;
  onClose: () => void;
  onLeftAction?: () => void;
  onRightAction?: () => void;
  color?: 'yellow' | 'purple';
  children?: React.ReactNode;
  leftText?: string;
  rightText?: string;
};

/**
 * A functional component that renders a centered informational dialog.
 * Features a high-visibility header, a backdrop overlay, and responsive width constraints.
 */
export const DecisionModal: React.FC<DecisionModalProps> = ({
  title,
  description,
  onClose,
  onLeftAction,
  onRightAction,
  color = 'yellow',
  children,
  leftText,
  rightText,
}) => {
  const headerBg = color === 'purple' ? 'bg-purple-primary' : 'bg-primary';
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-lg overflow-hidden shadow-lg border-2 border-[#AFB1B6]">
        <div
          className={`${headerBg} px-5 py-4 flex items-center justify-between border-b-2 border-[#AFB1B6]`}
        >
          <Text
            variant="body"
            weight="medium"
            className="text-white flex-1 text-center"
          >
            {title}
          </Text>
        </div>

        <div className="bg-white px-5 py-5">
          {children ?? (
            <Text variant="body" className="text-gray-700 leading-relaxed">
              {description}
            </Text>
          )}
          <div className="mt-5 flex flex-col-reverse lg:flex-row justify-center items-center justfiy-center lg:justify-between gap-4">
            {leftText && (
              <Button
                onClick={onLeftAction ?? onClose}
                variant={`${color === 'yellow' ? 'secondary' : 'purpleSecondary'}`}
                label={leftText}
              />
            )}
            {rightText && (
              <Button
                onClick={onRightAction ?? onClose}
                variant={`${color === 'yellow' ? 'primary' : 'purple'}`}
                label={rightText}
              />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
