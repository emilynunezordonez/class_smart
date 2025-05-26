import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginFormPage } from '../../../src/pages/login/LoginFormPage';
import { login } from '../../../src/api/users.api';
import toast from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

// Mocks
jest.mock('../../../src/api/users.api', () => ({
  login: jest.fn()
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
  },
}));

const mockedNavigate = jest.fn();

const setup = () => {
  return render(
    <BrowserRouter>
      <LoginFormPage />
    </BrowserRouter>
  );
};

describe('LoginFormPage', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockReset();
    toast.success.mockClear();
  });

  it('renderiza correctamente los campos y botones', () => {
    setup();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('LogIn')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Regístrate')).toBeInTheDocument();
  });

  it('envía formulario correctamente y redirige a /products si es staff', async () => {
    login.mockResolvedValue({
      data: {
        token: 'fake-token',
        user: { id: '123', is_staff: true }
      }
    });

    setup();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'adminpass' } });
    fireEvent.click(screen.getByText('LogIn'));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ username: 'admin', password: 'adminpass' });
      expect(localStorage.getItem('authToken')).toBe('fake-token');
      expect(localStorage.getItem('user_id')).toBe('123');
      expect(toast.success).toHaveBeenCalled();
      expect(mockedNavigate).toHaveBeenCalledWith('/products');
    });
  });

  it('envía formulario correctamente y redirige a /client si no es staff', async () => {
    login.mockResolvedValue({
      data: {
        token: 'token-user',
        user: { id: '321', is_staff: false }
      }
    });

    setup();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'client' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'clientpass' } });
    fireEvent.click(screen.getByText('LogIn'));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/client');
    });
  });

  it('muestra alert si login falla', async () => {
    login.mockRejectedValue(new Error('Error de login'));
    window.alert = jest.fn();

    setup();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'error' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('LogIn'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Datos incorrectos o el usuario no existe');
    });
  });

  it('navega a /register-user desde botón Sign Up', () => {
    setup();
    fireEvent.click(screen.getByText('Sign Up'));
    expect(mockedNavigate).toHaveBeenCalledWith('/register-user');
  });

  it('navega a /register-user desde texto Regístrate', () => {
    setup();
    fireEvent.click(screen.getByText('Regístrate'));
    expect(mockedNavigate).toHaveBeenCalledWith('/register-user');
  });

  it('no navega ni guarda si no se recibe token', async () => {
    login.mockResolvedValue({
      data: { user: { id: '123', is_staff: true } } // sin token
    });

    setup();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'adminpass' } });
    fireEvent.click(screen.getByText('LogIn'));

    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe(null);
      expect(mockedNavigate).not.toHaveBeenCalled();
    });
  });
});
