import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../../services/authService';


export function EmailVerification() {
  const { token } = useParams();
  const [status, setStatus] = useState('Verificando...');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('Email verificado exitosamente');
      } catch (error) {
        setStatus('Error en la verificación');
      }
    };

    verifyToken();
  }, [token]);

  return <div className='text-black'><h1>{status}</h1></div>;
}

