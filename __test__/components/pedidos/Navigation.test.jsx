import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navigation } from '../../../src/components/pedidos/Navigation';
import { BrowserRouter } from 'react-router-dom';
import * as categoryApi from '../../../src/api/categories.api';
import * as productApi from '../../../src/api/products.api';
import { useNavigate } from 'react-router-dom';

// Mock del hook useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock de las funciones externas
jest.mock('../../../src/api/categories.api');
jest.mock('../../../src/api/products.api');

describe('Navigation Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);

    categoryApi.getAllCategories.mockResolvedValue({
      data: [
        { id: 1, nombre: 'Electronica' },
        { id: 2, nombre: 'Ropa' },
      ],
    });

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  });

  test('renderiza enlaces principales', () => {
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText('Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('abre y cierra la barra de búsqueda correctamente', async () => {
    const buscarBtn = screen.getByLabelText('abrir búsqueda');
    fireEvent.click(buscarBtn);

    expect(await screen.findByPlaceholderText(/Buscar producto por/i)).toBeInTheDocument();

    const cancelarBtn = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelarBtn);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
    });
  });

  test('cambia el criterio de búsqueda', async () => {
    fireEvent.click(screen.getByLabelText('abrir búsqueda'));

    const select = await screen.findByRole('combobox');
    fireEvent.change(select, { target: { value: 'precio' } });

    const input = screen.getByPlaceholderText(/Buscar producto por/i);
    expect(input.placeholder).toMatch(/precio/);
  });

  test('realiza navegación al buscar', async () => {
    fireEvent.click(screen.getByLabelText('abrir búsqueda'));

    const input = await screen.findByPlaceholderText(/Buscar producto por/i);
    fireEvent.change(input, { target: { value: 'camisa' } });

    const form = input.closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/products/nombre/camisa');
    });
  });

  test('abre menú adicional y navega a sección del cliente', () => {
    fireEvent.click(screen.getByLabelText('adiocionales'));

    fireEvent.click(screen.getByText('Ir a Seccion del Cliente'));
    expect(mockNavigate).toHaveBeenCalledWith('/client');
  });

  test('navega a "Ver Todos", "Entregados", "Pendientes"', () => {
    const abrirMenu = () => fireEvent.click(screen.getByLabelText('adiocionales'));

    abrirMenu();
    fireEvent.click(screen.getByText('Ver Todos'));
    expect(mockNavigate).toHaveBeenCalledWith('/pedidos');

    abrirMenu();
    fireEvent.click(screen.getByText('Entregados'));
    expect(mockNavigate).toHaveBeenCalledWith('/pedidosFilter/1');

    abrirMenu();
    fireEvent.click(screen.getByText('Pendientes'));
    expect(mockNavigate).toHaveBeenCalledWith('/pedidosFilter/0');
  });

  test('cierra sesión correctamente', () => {
    localStorage.setItem('authToken', 'fake-token');
    const salirBtn = screen.getByLabelText('salir');
    fireEvent.click(salirBtn);

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
