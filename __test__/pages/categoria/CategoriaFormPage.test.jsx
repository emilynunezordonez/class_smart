import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CategoriaFormPage } from '../../../src/pages/categoria/CategoriaFormPage';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

// Mocks dinámicos
const mockUseParams = jest.fn();
const mockNavigate = jest.fn();
const mockConfirm = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

jest.mock('../../../src/api/categories.api', () => ({
  getCategoria: jest.fn(),
  updateCategoria: jest.fn(),
  deleteCategoria: jest.fn(),
  createCategoria: jest.fn()
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

beforeAll(() => {
  // mock de confirm global
  global.confirm = mockConfirm;
});

afterEach(() => {
  jest.clearAllMocks();
});

const setup = () =>
  render(
    <BrowserRouter>
      <CategoriaFormPage />
    </BrowserRouter>
  );

describe('CategoriaFormPage - modo edición (con id)', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: '1' });
    const { getCategoria } = require('../../../src/api/categories.api');
    getCategoria.mockResolvedValue({ data: { nombre_categoria: 'Categoría Editada' } });
  });

  it('renderiza correctamente con valores de la categoría', async () => {
    setup();

    expect(await screen.findByDisplayValue('Categoría Editada')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('actualiza categoría correctamente', async () => {
    const { updateCategoria } = require('../../../src/api/categories.api');
    setup();

    const input = await screen.findByDisplayValue('Categoría Editada');
    fireEvent.change(input, { target: { value: 'Actualizada' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() =>
      expect(updateCategoria).toHaveBeenCalledWith('1', { nombre_categoria: 'Actualizada' })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/categorias');
  });

  it('muestra error si updateCategoria falla', async () => {
    const { updateCategoria } = require('../../../src/api/categories.api');
    const toast = require('react-hot-toast').default;
    updateCategoria.mockRejectedValue(new Error('Forbidden'));

    setup();

    const input = await screen.findByDisplayValue('Categoría Editada');
    fireEvent.change(input, { target: { value: 'Actualizada' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('elimina categoría si el usuario confirma', async () => {
    const { deleteCategoria } = require('../../../src/api/categories.api');
    mockConfirm.mockReturnValue(true);

    setup();

    await screen.findByDisplayValue('Categoría Editada');
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(deleteCategoria).toHaveBeenCalledWith('1'));
    expect(mockNavigate).toHaveBeenCalledWith('/categorias');
  });

  it('no elimina categoría si el usuario cancela', async () => {
    const { deleteCategoria } = require('../../../src/api/categories.api');
    mockConfirm.mockReturnValue(false);

    setup();

    await screen.findByDisplayValue('Categoría Editada');
    fireEvent.click(screen.getByText('Delete'));

    expect(deleteCategoria).not.toHaveBeenCalled();
  });
});

describe('CategoriaFormPage - modo creación (sin id)', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({});
  });

  it('renderiza formulario vacío', async () => {
    setup();
    expect(await screen.findByPlaceholderText('Ingresa el nombre de la categoria')).toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('crea categoría correctamente', async () => {
    const { createCategoria } = require('../../../src/api/categories.api');
    const inputValue = 'Nueva Categoría';

    setup();

    const input = await screen.findByPlaceholderText('Ingresa el nombre de la categoria');
    fireEvent.change(input, { target: { value: inputValue } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() =>
      expect(createCategoria).toHaveBeenCalledWith({ nombre_categoria: inputValue })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/categorias');
  });

  it('muestra error si createCategoria falla', async () => {
    const { createCategoria } = require('../../../src/api/categories.api');
    const toast = require('react-hot-toast').default;
    createCategoria.mockRejectedValue(new Error('Forbidden'));

    setup();

    const input = await screen.findByPlaceholderText('Ingresa el nombre de la categoria');
    fireEvent.change(input, { target: { value: 'Error' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});

describe('Navegación', () => {
  it('navega hacia atrás al hacer clic en Back', async () => {
    mockUseParams.mockReturnValue({});
    setup();

    const backButton = await screen.findByText('Back');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/categorias/');
  });
});

describe('Errores en CategoriaFormPage', () => {
  const toast = require('react-hot-toast').default;

  it('muestra error si getCategoria falla al cargar', async () => {
    const { getCategoria } = require('../../../src/api/categories.api');
    mockUseParams.mockReturnValue({ id: '999' });

    getCategoria.mockRejectedValue(new Error('Error al obtener'));

    setup();

    await waitFor(() => {
      expect(getCategoria).toHaveBeenCalledWith('999');
    });
    // No se lanza toast aquí, pero sí se muestra error en consola
  });

  it('muestra error si updateCategoria falla', async () => {
    const { getCategoria, updateCategoria } = require('../../../src/api/categories.api');
    mockUseParams.mockReturnValue({ id: '1' });

    getCategoria.mockResolvedValue({ data: { nombre_categoria: 'ErrorCat' } });
    updateCategoria.mockRejectedValue(new Error('No autorizado'));

    setup();

    const input = await screen.findByDisplayValue('ErrorCat');
    fireEvent.change(input, { target: { value: 'Actualizada' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(updateCategoria).toHaveBeenCalledWith('1', { nombre_categoria: 'Actualizada' });
      expect(toast.error).toHaveBeenCalledWith(
        'Usted no tiene permiso para realizar esta acción',
        expect.anything()
      );
    });
  });

  it('muestra error si createCategoria falla', async () => {
    const { createCategoria } = require('../../../src/api/categories.api');
    mockUseParams.mockReturnValue({});

    createCategoria.mockRejectedValue(new Error('No autorizado'));

    setup();

    const input = await screen.findByPlaceholderText('Ingresa el nombre de la categoria');
    fireEvent.change(input, { target: { value: 'Categoría Fallida' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(createCategoria).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        'Usted no tiene permiso para realizar esta acción',
        expect.anything()
      );
    });
  });

  it('muestra error si deleteCategoria falla', async () => {
    const { getCategoria, deleteCategoria } = require('../../../src/api/categories.api');
    mockUseParams.mockReturnValue({ id: '1' });
    mockConfirm.mockReturnValue(true);

    getCategoria.mockResolvedValue({ data: { nombre_categoria: 'ParaBorrar' } });
    deleteCategoria.mockRejectedValue(new Error('No autorizado'));

    setup();

    await screen.findByDisplayValue('ParaBorrar');
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(deleteCategoria).toHaveBeenCalledWith('1');
      expect(toast.error).toHaveBeenCalledWith(
        'Usted no tiene permiso para realizar esta acción',
        expect.anything()
      );
    });
  });
});
