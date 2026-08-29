import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/forgot-password', { replace: true });
  }, [navigate]);
  return null;
};
