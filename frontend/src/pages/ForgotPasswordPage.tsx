import { useNavigate } from 'react-router';
import { HiHome } from 'react-icons/hi2';
import { ForgotPasswordForm } from '@features/auth/components/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center">
      <button className="top-0 h-8 my-2 w-full flex items-start justify-start">
        <HiHome
          size="100%"
          className="aspect-square text-primary w-fit ml-4 cursor-pointer"
          onClick={() => navigate('/')}
        />
      </button>

      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
