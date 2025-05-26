import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PedidosFilterPage } from '../../../src/pages/pedidos/PedidosFilterPage';
import * as pedidosApi from '../../../src/api/pedidos.api';
import React from 'react';

jest.mock('../../../src/pages/cliente/ClientFavorites', () => ({
  __esModule: true,
  default: () => <div data-testid="client-favorites" />,
}));

// Mock de componentes hijos
jest.mock('../../../src/components/pedidos/Navigation', () => ({
  Navigation: () => <div data-testid="navigation" />,
}));

jest.mock('../../../src/components/pedidos/PedidoCard', () => ({
  PedidoCard: ({ pedido }) => <div data-testid="pedido-card">{pedido.id}</div>,
}));

// Mock de useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('PedidosFilterPage', () => {
  const mockPedidos = [
    { id: 1, estado_pedido: true },
    { id: 2, estado_pedido: false },
    { id: 3, estado_pedido: true },
    { id: 4, estado_pedido: false },
  ];

  beforeEach(() => {
    jest.spyOn(pedidosApi, 'getAllPedidos').mockResolvedValue({ data: mockPedidos });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('muestra solo los pedidos entregados si estado=1', async () => {
    const { useParams } = require('react-router-dom');
    useParams.mockReturnValue({ estado: '1' });

    render(
      <MemoryRouter initialEntries={['/pedidos/1']}>
        <Routes>
          <Route path="/pedidos/:estado" element={<PedidosFilterPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const cards = screen.getAllByTestId('pedido-card');
      expect(cards).toHaveLength(2);
      expect(cards[0]).toHaveTextContent('1');
      expect(cards[1]).toHaveTextContent('3');
    });

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('muestra solo los pedidos no entregados si estado≠1', async () => {
    const { useParams } = require('react-router-dom');
    useParams.mockReturnValue({ estado: '0' });

    render(
      <MemoryRouter initialEntries={['/pedidos/0']}>
        <Routes>
          <Route path="/pedidos/:estado" element={<PedidosFilterPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const cards = screen.getAllByTestId('pedido-card');
      expect(cards).toHaveLength(2);
      expect(cards[0]).toHaveTextContent('2');
      expect(cards[1]).toHaveTextContent('4');
    });

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('maneja errores en getAllPedidos', async () => {
    const { useParams } = require('react-router-dom');
    useParams.mockReturnValue({ estado: '1' });

    jest.spyOn(pedidosApi, 'getAllPedidos').mockRejectedValue(new Error('Error de red'));

    render(
      <MemoryRouter initialEntries={['/pedidos/1']}>
        <Routes>
          <Route path="/pedidos/:estado" element={<PedidosFilterPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // No se renderiza ningún card si falla
      expect(screen.queryByTestId('pedido-card')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });
});
