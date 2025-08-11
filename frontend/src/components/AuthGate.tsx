import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

interface Props { children: React.ReactNode }

const AuthGate: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) setOpenLogin(true);
  }, [isAuthenticated]);

  const openRegisterFromLogin = () => {
    setOpenLogin(false);
    setOpenRegister(true);
  };
  const openLoginFromRegister = () => {
    setOpenRegister(false);
    setOpenLogin(true);
  };

  return (
    <>
      {!isAuthenticated && (
        <>
          <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} onSuccess={() => setOpenLogin(false)} onOpenRegister={openRegisterFromLogin} />
          <RegisterModal show={openRegister} onClose={() => setOpenRegister(false)} onRegistered={() => setOpenRegister(false)} onOpenLogin={openLoginFromRegister} />
        </>
      )}
      {children}
    </>
  );
};

export default AuthGate;

