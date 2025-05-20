import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClientFavorites } from '../../../src/pages/cliente/ClientFavorites';
import { getAllFavoritos, getAllProducts } from '../../../src/api/products.api';


// Mock de las dependencias
jest.mock('../../../src/api/products.api', () => ({
  getAllFavoritos: jest.fn(),
  getAllProducts: jest.fn(),
}));

jest.mock('../../../src/services/authService', () => ({}));

jest.mock("../../../src/components/cliente/Navigation", () => ({
  Navigation: () => <div data-testid="navigation">Navigation</div>
}));

jest.mock("../../../src/components/cliente/ClientCard", () => ({
  ClientCard: ({ product }) => <div data-testid="client-card">{product.nombre}</div>
}));

describe('ClientFavorites', () => {
  const mockUserId = 123;
  const mockFavorites = [
    { id: 1, usuario: mockUserId, producto: 101 },
    { id: 2, usuario: mockUserId, producto: 102 },
    { id: 3, usuario: 456, producto: 103 } // Este no debería aparecer
  ];

  const mockProducts = [
    { id: 101, nombre: 'Producto 1' },
    { id: 102, nombre: 'Producto 2' }
  ];

  beforeEach(() => {
    localStorage.setItem('user_id', mockUserId);
    getAllFavoritos.mockResolvedValue({ data: mockFavorites });
    getAllProducts.mockResolvedValue({ data: mockProducts });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('debería cargar y mostrar los favoritos del usuario correctamente', async () => {
    render(<ClientFavorites />);

    // Verificar llamadas a la API
    expect(getAllFavoritos).toHaveBeenCalledTimes(1);
    
    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalledTimes(1);
    });

    // Verificar que se muestran solo los productos favoritos del usuario
    const cards = await screen.findAllByTestId('client-card');
    expect(cards).toHaveLength(2);
    expect(cards[0].textContent).toBe('Producto 1');
    expect(cards[1].textContent).toBe('Producto 2');
  });

  it('debería mostrar el componente Navigation', async () => {
    render(<ClientFavorites />);
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('debería manejar cuando no hay favoritos', async () => {
    getAllFavoritos.mockResolvedValue({ data: [] });
    render(<ClientFavorites />);

    await waitFor(() => {
      expect(screen.queryByTestId('client-card')).not.toBeInTheDocument();
    });
  });

  it('debería manejar errores al cargar favoritos', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getAllFavoritos.mockRejectedValue(new Error('Error de API'));

    render(<ClientFavorites />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching favorites:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('debería manejar errores al cargar productos', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    getAllProducts.mockRejectedValue(new Error('Error de productos'));

    render(<ClientFavorites />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'error al cargar los productos del usuario en PedidosClientePage', 
        expect.any(Error)
    );
    });

    consoleErrorSpy.mockRestore();
  });


});