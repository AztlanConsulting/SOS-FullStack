import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';

function useClickOutside(
  dropdownRef: RefObject<HTMLDivElement | null>,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener for clicks outside the dropdown
    document.addEventListener('pointerdown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [setIsOpen]);
}

export default useClickOutside;
