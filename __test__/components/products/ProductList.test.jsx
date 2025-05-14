import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProductList } from '../../../src/components/products/ProductList';
import '@testing-library/jest-dom';

// Mock completo de la API
jest.mock('../../../src/api/products.api', () => ({
  getAllProducts: jest.fn(),
  searchProducts: jest.fn(),
}));

// Importar los mocks después del jest.mock
import { getAllProducts, searchProducts } from '../../../src/api/products.api';

// Mock de ProductCard
jest.mock('../../../src/components/products/ProductCard', () => ({
  ProductCard: ({ product }) => (
    <div data-testid="product-card">{product.name}</div>
  )
}));

describe('ProductList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('usa getAllProducts cuando no se pasan criterios de búsqueda', async () => {
    const mockProducts = [{ id: 1, name: 'Producto A' }, { id: 2, name: 'Producto B' }];
    getAllProducts.mockResolvedValue({ data: mockProducts });

    render(<ProductList />);

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalled();
      expect(screen.getByText('Producto A')).toBeInTheDocument();
      expect(screen.getByText('Producto B')).toBeInTheDocument();
    });
  });

  test('usa searchProducts cuando se pasan criterios de búsqueda', async () => {
    const mockProducts = {
      data: {
        products: [{ id: 3, name: 'Producto X' }, { id: 4, name: 'Producto Y' }]
      }
    };
    searchProducts.mockResolvedValue(mockProducts);

    render(<ProductList searchCriteria="name" searchValue="X" />);

    await waitFor(() => {
      expect(searchProducts).toHaveBeenCalledWith('name', 'X');
      expect(screen.getByText('Producto X')).toBeInTheDocument();
      expect(screen.getByText('Producto Y')).toBeInTheDocument();
    });
  });

  test('renderiza sin productos si la API devuelve vacío', async () => {
    getAllProducts.mockResolvedValue({ data: [] });

    render(<ProductList />);

    await waitFor(() => {
      const cards = screen.queryAllByTestId('product-card');
      expect(cards.length).toBe(0);
    });
  });

  test('usa getAllProducts si solo searchCriteria está definido', async () => {
    getAllProducts.mockResolvedValue({ data: [] });

    render(<ProductList searchCriteria="category" />);

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalled();
      expect(searchProducts).not.toHaveBeenCalled();
    });
  });

  test('maneja error si searchProducts falla', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    searchProducts.mockRejectedValue(new Error('error buscador'));

    render(<ProductList searchCriteria="name" searchValue="X" />);

    await waitFor(() => {
      expect(searchProducts).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Error al cargar los datos');
    });

    consoleSpy.mockRestore();
  });

  test('maneja error si getAllProducts falla', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    getAllProducts.mockRejectedValue(new Error('fallo getAll'));

    render(<ProductList />);

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Error al cargar los datos');
    });

    consoleSpy.mockRestore();
  });

test('vuelve a buscar productos si cambian los props', async () => {
  const mockFirstCall = {
    data: {
      products: []  // <--- Asegúrate que existe
    }
  };
  const mockSecondCall = {
    data: {
      products: [{ id: 5, name: 'Producto Z' }]
    }
  };

  searchProducts
    .mockResolvedValueOnce(mockFirstCall)
    .mockResolvedValueOnce(mockSecondCall);

  const { rerender } = render(<ProductList searchCriteria="name" searchValue="Old" />);

  // Primera render
  await waitFor(() => {
    expect(searchProducts).toHaveBeenCalledWith('name', 'Old');
  });

  // Cambia props
  rerender(<ProductList searchCriteria="name" searchValue="New" />);

  await waitFor(() => {
    expect(searchProducts).toHaveBeenCalledWith('name', 'New');
    expect(screen.getByText('Producto Z')).toBeInTheDocument();
  });
});

});
