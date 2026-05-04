import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ size = 'md' }: Props) => {
  const sizes = {
    sm: 14,
    md: 20,
    lg: 24,
  };

  return (
    <div className="w-full h-full flex items-center align-middle justify-center">
      <AiOutlineLoading3Quarters
        className={`size-${sizes[size]} animate-spin text-black mb-60 mt-40`}
      />
    </div>
  );
};

export default LoadingSpinner;
