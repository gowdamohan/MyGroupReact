import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const hideNavbarOnRoutes = ['/'];
  const hideNavbar = hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

export default RootLayout;

