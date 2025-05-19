import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navigation } from "../../../src/components/categoria/Navigation";
import { BrowserRouter } from 'react-router-dom';
import * as categoriesApi from "../../../src/api/categories.api";
import '@testing-library/jest-dom';

// Mock de useNavigate de react-router-dom
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock de la API de categorías
jest.mock('../../../src/api/categories.api', () => ({
  getAllCategories: jest.fn().mockResolvedValue({ data: ['Categoria1', 'Categoria2'] })
}));

describe('Navigation', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  });

  test('llama a getAllCategories al montar', () => {
    expect(categoriesApi.getAllCategories).toHaveBeenCalledTimes(1);
  });

  test('renderiza enlaces de navegación principales', () => {
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText('Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('abre la barra de búsqueda al hacer clic en el botón de búsqueda', async () => {
    const searchBtn = screen.getByLabelText('abrir-busqueda');
    fireEvent.click(searchBtn);

    const input = await screen.findByPlaceholderText(/Buscar producto por/i);
    expect(input).toBeInTheDocument();
  });

  test('realiza navegación al hacer submit en búsqueda', async () => {
    // Abrir búsqueda
    const searchBtn = screen.getByLabelText('abrir-busqueda');
    fireEvent.click(searchBtn);

    // Esperar input
    const input = await screen.findByPlaceholderText(/Buscar producto por/i);
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'telefono' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/categoriasBusqueda/telefono');
    });
  });

  test('cierra sesión y navega al login al hacer clic en el botón de salir', () => {
    const logoutBtn = screen.getByLabelText('cerrar-sesion');
    fireEvent.click(logoutBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  test('navega al formulario de categoría al hacer clic en el botón de agregar', () => {
    const addBtn = screen.getByLabelText('agregar-categoria');
    fireEvent.click(addBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/categoriasForm');
  });

  //Nuevos
  test('permite cambiar el criterio de búsqueda', async () => {
    fireEvent.click(screen.getByLabelText('abrir-busqueda'));
    const select = await screen.findByRole('combobox');
    fireEvent.change(select, { target: { value: 'nombre' } });

    const input = await screen.findByPlaceholderText(/Buscar producto por nombre/i);
    expect(input).toBeInTheDocument();
  });

  test('cierra la barra de búsqueda al hacer clic en Cancelar', async () => {
    fireEvent.click(screen.getByLabelText('abrir-busqueda'));

    const cancelBtn = await screen.findByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
        expect(screen.queryByPlaceholderText(/Buscar producto por/i)).not.toBeInTheDocument();
    });
  });

  test('cierra sesión y redirige al login', () => {
    localStorage.setItem('authToken', 'mockToken');

    const logoutBtn = screen.getByLabelText('cerrar-sesion');

    fireEvent.click(logoutBtn);

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  test('redirige al formulario de categorías al hacer clic en el botón flotante', () => {
    const addBtn = screen.getByLabelText('agregar-categoria');

    fireEvent.click(addBtn);

    expect(mockedNavigate).toHaveBeenCalledWith('/categoriasForm');
  });



});
