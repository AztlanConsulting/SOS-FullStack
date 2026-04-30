import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const SpeiSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 w-full bg-white rounded-lg shadow-md border border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800">
          SPEI Transfer
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 pb-4 border-t border-gray-200 text-sm text-gray-700 space-y-3">
          <div>
            <p className="font-semibold text-gray-800 mb-1">CLABE:</p>
            <p className="text-gray-600">646 180 15600 0021 501</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Bank Name:</p>
            <p className="text-gray-600">Banco STP</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Account Holder:</p>
            <p className="text-gray-600">Your Company Name</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Instructions:</p>
            <p className="text-gray-600">
              Use your CLABE to transfer funds. Please include your order
              reference in the concept field.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeiSection;
