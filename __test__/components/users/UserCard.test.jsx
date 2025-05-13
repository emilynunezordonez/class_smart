import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { UserCard } from '../../../src/components/users/UserCard'; // Ajusta la ruta según tu estructura
import '@testing-library/jest-dom';

// Mock de useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('UserCard', () => {
  const mockUser = {
    id: 1,
    username: 'UsuarioPrueba',
    email: 'usuario@correo.com',
  };

  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('se renderiza correctamente con los datos del usuario', () => {
    render(
      <MemoryRouter>
        <UserCard user={mockUser} />
      </MemoryRouter>
    );

    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  test('navega correctamente al hacer clic en la tarjeta', () => {
    render(
      <MemoryRouter>
        <UserCard user={mockUser} />
      </MemoryRouter>
    );

    const card = screen.getByText(mockUser.username).closest('div');
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith(`/users-create/${mockUser.id}`);
  });
});