import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';

export const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handle = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    await login(email, password);
    navigate('/');
  };

  return (
    <form onSubmit={handle}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};
