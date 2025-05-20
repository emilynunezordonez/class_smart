import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PedidoCard } from '../../../src/components/pedidos/PedidoCard';
import { getUser } from '../../../src/api/users.api';
import { MemoryRouter } from 'react-router-dom';

// Mock getUser API
jest.mock('../../../src/api/users.api', () => ({
  getUser: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('PedidoCard', () => {
  const pedidoMock = {
    id: 5,
    usuarios: 10,
    metodo_pago: 'Efectivo',
    fecha: '2024-05-19',
    hora: '12:00',
    direccion: 'Calle 123',
    estado_pedido: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('muestra los datos del pedido y el usuario cargando', async () => {
    getUser.mockResolvedValueOnce({ data: { username: 'Juan' } });

    render(
      <MemoryRouter>
        <PedidoCard pedido={pedidoMock} />
      </MemoryRouter>
    );

    // Usar función para buscar texto fragmentado
    expect(
      screen.getByText((content, node) =>
        node.textContent === 'Pedido #5'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, node) =>
        node.textContent === 'Cliente: Cargando...'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, node) =>
        node.textContent === 'Método de pago: Efectivo'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, node) =>
        node.textContent === 'Fecha: 2024-05-19'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, node) =>
        node.textContent === 'Hora: 12:00'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, node) =>
        node.textContent === 'Direccion: Calle 123'
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/PENDIENTE/i)).toBeInTheDocument();

    // Espera a que el usuario se cargue
    await waitFor(() => {
      expect(
        screen.getByText((content, node) =>
          node.textContent === 'Cliente: Juan'
        )
      ).toBeInTheDocument();
    });
  });

  it('muestra ENTREGADO si estado_pedido es true', async () => {
    getUser.mockResolvedValueOnce({ data: { username: 'Ana' } });

    render(
      <MemoryRouter>
        <PedidoCard pedido={{ ...pedidoMock, estado_pedido: true }} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ENTREGADO/i)).toBeInTheDocument();
    });
  });

  it('navega al hacer click en el card', async () => {
    getUser.mockResolvedValueOnce({ data: { username: 'Juan' } });

    render(
      <MemoryRouter>
        <PedidoCard pedido={pedidoMock} />
      </MemoryRouter>
    );

    // Busca el card por el texto fragmentado y sube al div clickable
    const card = screen.getByText((content, node) =>
      node.textContent === 'Pedido #5'
    ).closest('div[role="presentation"],div');

    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/pedidosProductos/5/10');
  });

  it('maneja error al cargar usuario', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getUser.mockRejectedValueOnce(new Error('Error de usuario'));

    render(
      <MemoryRouter>
        <PedidoCard pedido={pedidoMock} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});