import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navigation } from '../../../src/components/users/Navigation';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Mock de useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Navigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  test('navega correctamente con los enlaces principales', () => {
    render(<Navigation />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText('Productos'));
    fireEvent.click(screen.getByText('Usuarios'));
    fireEvent.click(screen.getByText('Categorias'));
    fireEvent.click(screen.getByText('Pedidos'));
    fireEvent.click(screen.getByText('Dashboard'));

    // La navegación real se prueba con integración, aquí solo verificamos que estén los enlaces
    expect(screen.getByText('Productos')).toBeInTheDocument();
  });

  test('abre y cierra buscador, cambia criterio y realiza búsqueda', () => {
    render(<Navigation />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByLabelText('Abrir búsqueda'));

    const input = screen.getByPlaceholderText(/Buscar usuario por username/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'juan' } });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'email' } });

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(screen.queryByPlaceholderText(/Buscar usuario/i)).not.toBeInTheDocument();

    // Repetir búsqueda válida
    fireEvent.click(screen.getByLabelText('Abrir búsqueda'));
    fireEvent.change(screen.getByPlaceholderText(/Buscar usuario/i), {
      target: { value: 'maria' },
    });
    fireEvent.click(screen.getByRole('button', { name: '' })); // botón de buscar con ícono

    expect(mockNavigate).toHaveBeenCalledWith('/users/email/maria');
  });

  test('botón cerrar sesión borra token y navega', () => {
    localStorage.setItem('authToken', '1234');

    render(<Navigation />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByLabelText('Cerrar sesión'));
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/client');
  });

  test('muestra y navega desde menú de acciones flotante', () => {
    render(<Navigation />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByLabelText('Abrir menú de acciones'));

    fireEvent.click(screen.getByText('Ir a Seccion del Cliente'));
    expect(mockNavigate).toHaveBeenCalledWith('/client');

    // Reabrir menú para siguiente prueba
    fireEvent.click(screen.getByLabelText('Abrir menú de acciones'));
    fireEvent.click(screen.getByText('Crear usuario'));
    expect(mockNavigate).toHaveBeenCalledWith('/users-create');
  });

  test('despliega submenu de permisos y navega correctamente', () => {
    render(<Navigation />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByLabelText('Abrir menú de acciones'));
    const permisosBtn = screen.getByText(/Ver por Permisos/i);
    fireEvent.click(permisosBtn);

    fireEvent.click(screen.getByText('Ver Todo'));
    expect(mockNavigate).toHaveBeenCalledWith('/users');

    fireEvent.click(screen.getByLabelText('Abrir menú de acciones'));
    fireEvent.click(screen.getByText(/Ver por Permisos/i));
    fireEvent.click(screen.getByText('Clientes'));
    expect(mockNavigate).toHaveBeenCalledWith('/users/is_staff/false');

    fireEvent.click(screen.getByLabelText('Abrir menú de acciones'));
    fireEvent.click(screen.getByText(/Ver por Permisos/i));
    fireEvent.click(screen.getByText('Empleados'));
    expect(mockNavigate).toHaveBeenCalledWith('/users/is_staff/true');

    fireEvent.click(screen.getByLabelText('Abrir menú de acciones'));
    fireEvent.click(screen.getByText(/Ver por Permisos/i));
    fireEvent.click(screen.getByText('Super Usuarios'));
    expect(mockNavigate).toHaveBeenCalledWith('/users/is_superuser/true');
  });
});