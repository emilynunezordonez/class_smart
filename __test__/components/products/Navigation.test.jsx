import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navigation } from '../../../src/components/products/Navigation';
import { BrowserRouter } from 'react-router-dom';
import * as categoryApi from '../../../src/api/categories.api';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../../src/api/categories.api');

describe('Navigation Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(async () => {
    useNavigate.mockReturnValue(mockNavigate);

    categoryApi.getAllCategories.mockResolvedValue({
      data: [
        { id: 1, nombre_categoria: 'Electrónica' },
        { id: 2, nombre_categoria: 'Ropa' }
      ],
    });

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    // Esperar a que las categorías se carguen
    await waitFor(() => {
      expect(categoryApi.getAllCategories).toHaveBeenCalled();
    });
  });

  test('renderiza los enlaces principales', () => {
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText('Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('abre y cierra la barra de búsqueda correctamente', async () => {
    // Abrir buscador usando aria-label
    fireEvent.click(screen.getByLabelText('abrir buscador'));

    const input = await screen.findByPlaceholderText(/Buscar producto por/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'camisa' } });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'precio' } });
    expect(select.value).toBe('precio');

    // Cerrar buscador
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Buscar producto por/i)).not.toBeInTheDocument();
    });
  });

  test('realiza navegación al hacer una búsqueda', async () => {
    fireEvent.click(screen.getByLabelText('abrir buscador'));

    const input = await screen.findByPlaceholderText(/Buscar producto por/i);
    fireEvent.change(input, { target: { value: 'televisor' } });

    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/products/nombre/televisor');
    });
  });

  test('abre menú adicional y navega a cliente', async () => {
    fireEvent.click(screen.getByLabelText('abrir menú de acciones'));

    // Esperar a que el menú se muestre
    const cliente = await screen.findByText('Ir a Seccion del Cliente');
    fireEvent.click(cliente);

    expect(mockNavigate).toHaveBeenCalledWith('/client');
  });

  test('navega a creación de producto', async () => {
    fireEvent.click(screen.getByLabelText('abrir menú de acciones'));

    const crearProducto = await screen.findByText('Crear Producto');
    fireEvent.click(crearProducto);

    expect(mockNavigate).toHaveBeenCalledWith('/product-create');
  });

  test('navega a ver todos los productos desde menú por categoría', async () => {
    fireEvent.click(screen.getByLabelText('abrir menú de acciones'));

    const verPorCategoria = await screen.findByLabelText('abrir menú de categorías');
    fireEvent.click(verPorCategoria);

    const verTodo = await screen.findByText('Ver Todo');
    fireEvent.click(verTodo);

    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });

  test('navega a una categoría específica', async () => {
    fireEvent.click(screen.getByLabelText('abrir menú de acciones'));

    const verPorCategoria = await screen.findByLabelText('abrir menú de categorías');
    fireEvent.click(verPorCategoria);

    const categoriaItem = await screen.findByText('Electrónica');
    fireEvent.click(categoriaItem);

    expect(mockNavigate).toHaveBeenCalledWith('/products/categoria_id/1');
  });

  test('cierra sesión y redirige al login', () => {
    localStorage.setItem('authToken', 'token-de-prueba');

    // Buscar botón logout por aria-label
    const logoutBtn = screen.getByLabelText('cerrar sesión');
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
