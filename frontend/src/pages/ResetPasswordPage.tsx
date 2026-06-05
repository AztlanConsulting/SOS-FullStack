import { useNavigate } from 'react-router';
import { HiHome } from 'react-icons/hi2';
import { ResetPasswordForm } from '@features/auth/components/ResetPasswordForm';

const ResetPasswordPage = () => {
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

      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
