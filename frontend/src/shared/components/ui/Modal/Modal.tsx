import React from 'react';
import { HiX } from 'react-icons/hi';
import { Text } from '../Text';

/**
 * Configuration properties for the Modal component.
 */
type ModalProps = {
  title: string;
  description: string;
  onClose: () => void;
};

/**
 * A functional component that renders a centered informational dialog.
 * Features a high-visibility header, a backdrop overlay, and responsive width constraints.
 */
export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-lg overflow-hidden shadow-lg border-2 border-[#AFB1B6]">
        <div className="bg-[#F9CD48] px-5 py-4 flex items-center justify-between border-b-2 border-[#AFB1B6]">
          <Text
            variant="body"
            weight="medium"
            className="text-white flex-1 text-center"
          >
            {title}
          </Text>
          <button onClick={onClose} className="ml-2 shrink-0 cursor-pointer">
            <HiX size={20} className="text-white" />
          </button>
        </div>

        <div className="bg-white px-5 py-5">
          <Text variant="body" className="text-gray-700 leading-relaxed">
            {description}
          </Text>
        </div>
      </div>
    </div>
  );
};
