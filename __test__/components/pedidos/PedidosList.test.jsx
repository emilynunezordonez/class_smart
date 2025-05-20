import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getAllPedidos } from "../../../src/api/pedidos.api";
import { PedidosList } from "../../../src/components/pedidos/PedidosList";

// Mock the API
jest.mock("../../../src/api/pedidos.api", () => ({
  getAllPedidos: jest.fn(),
}));

// Mock the PedidoCard component
jest.mock("../../../src/components/pedidos/PedidoCard", () => ({
  PedidoCard: ({ pedido }) => <div data-testid="pedido-card">Pedido {pedido.id}</div>
}));

describe('PedidosList', () => {
  const mockPedidos = [
    { id: 1, cliente: 'Cliente 1', estado: 'pendiente' },
    { id: 2, cliente: 'Cliente 2', estado: 'completado' },
  ];

  beforeEach(() => {
    getAllPedidos.mockResolvedValue({ data: mockPedidos });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería cargar y mostrar los pedidos correctamente', async () => {
    render(<PedidosList />);

    // Verificar que se llamó a la API
    expect(getAllPedidos).toHaveBeenCalledTimes(1);

    // Esperar a que los pedidos se muestren
    const cards = await screen.findAllByTestId('pedido-card');
    
    // Verificar que se renderizaron los cards correctamente
    expect(cards).toHaveLength(2);
    expect(cards[0].textContent).toBe('Pedido 1');
    expect(cards[1].textContent).toBe('Pedido 2');
  });

  it('debería manejar una lista vacía de pedidos', async () => {
    getAllPedidos.mockResolvedValue({ data: [] });
    
    render(<PedidosList />);

    await waitFor(() => {
      expect(screen.queryByTestId('pedido-card')).not.toBeInTheDocument();
    });
  });

  it('debería manejar errores de la API', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getAllPedidos.mockRejectedValue(new Error('Error de API'));

    render(<PedidosList />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching pedidos:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  
});