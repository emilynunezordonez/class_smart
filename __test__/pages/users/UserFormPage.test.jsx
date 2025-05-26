// tests/pages/UserFormPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserFormPage } from '../../../src/pages/users/UserFormPage';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, updateUser, registerUser, deleteUser } from '../../../src/api/users.api';
import toast from 'react-hot-toast';

// Mocks
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn()
}));

jest.mock('../../../src/api/users.api', () => ({
  getUser: jest.fn(),
  updateUser: jest.fn(),
  registerUser: jest.fn(),
  deleteUser: jest.fn()
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

const fillForm = () => {
  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'john' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '1234' } });
  fireEvent.change(screen.getByPlaceholderText('Write your parssword again'), { target: { value: '1234' } });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Staff' } });
};

describe('UserFormPage', () => {
  const mockNavigate = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renderiza formulario de creación', () => {
    useParams.mockReturnValue({});
    render(<UserFormPage />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  });

  it('envía formulario y registra nuevo usuario exitosamente', async () => {
    useParams.mockReturnValue({});
    registerUser.mockResolvedValue({});
    render(<UserFormPage />);
    fillForm();
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Usuario creado exitosamente', expect.anything());
      expect(mockNavigate).toHaveBeenCalledWith('/users');
    });
  });

  it('muestra error al registrar usuario', async () => {
    useParams.mockReturnValue({});
    registerUser.mockRejectedValue({ response: { data: { detail: 'Error' } } });
    render(<UserFormPage />);
    fillForm();
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error', expect.anything());
    });
  });

  it('renderiza formulario de edición y carga datos', async () => {
    useParams.mockReturnValue({ id: '1' });
    getUser.mockResolvedValue({
      data: { username: 'admin', email: 'admin@example.com', is_staff: true, is_superuser: false }
    });
    render(<UserFormPage />);
    await waitFor(() => {
      expect(getUser).toHaveBeenCalledWith('1');
    });
  });

  it('actualiza usuario exitosamente', async () => {
    useParams.mockReturnValue({ id: '1' });
    getUser.mockResolvedValue({
      data: { username: 'admin', email: 'admin@example.com', is_staff: true, is_superuser: false }
    });
    updateUser.mockResolvedValue({});
    render(<UserFormPage />);
    await waitFor(() => fillForm());
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(updateUser).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Usuario actualizado correctamente', expect.anything());
      expect(mockNavigate).toHaveBeenCalledWith('/users');
    });
  });

  it('muestra error al actualizar usuario', async () => {
    useParams.mockReturnValue({ id: '1' });
    getUser.mockResolvedValue({
      data: { username: 'admin', email: 'admin@example.com', is_staff: true, is_superuser: false }
    });
    updateUser.mockRejectedValue({ response: { data: { detail: 'Error al actualizar' } } });
    render(<UserFormPage />);
    await waitFor(() => fillForm());
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al actualizar', expect.anything());
    });
  });

  it('elimina usuario exitosamente', async () => {
    useParams.mockReturnValue({ id: '1' });
    getUser.mockResolvedValue({
      data: { username: 'admin', email: 'admin@example.com', is_staff: true, is_superuser: false }
    });
    deleteUser.mockResolvedValue({});
    render(<UserFormPage />);
    await waitFor(() => fillForm());
    // Mock confirm
    window.confirm = jest.fn(() => true);
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith('1');
      expect(toast.success).toHaveBeenCalledWith('Usuario eliminado exitosamente', expect.anything());
      expect(mockNavigate).toHaveBeenCalledWith('/users');
    });
  });

  it('muestra error al eliminar usuario', async () => {
    useParams.mockReturnValue({ id: '1' });
    getUser.mockResolvedValue({
      data: { username: 'admin', email: 'admin@example.com', is_staff: true, is_superuser: false }
    });
    deleteUser.mockRejectedValue({});
    render(<UserFormPage />);
    await waitFor(() => fillForm());
    window.confirm = jest.fn(() => true);
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No tienes permiso para realizar esta acción', expect.anything());
    });
  });

  it('muestra error si las contraseñas no coinciden', async () => {
    useParams.mockReturnValue({});
    render(<UserFormPage />);
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '1234' } });
    fireEvent.change(screen.getByPlaceholderText('Write your parssword again'), { target: { value: '0000' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });
  });

  it('navega al hacer clic en "Back"', () => {
    useParams.mockReturnValue({});
    render(<UserFormPage />);
    fireEvent.click(screen.getByText('Back'));
    expect(mockNavigate).toHaveBeenCalledWith('/users');
  });
});
