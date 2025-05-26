import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PedidosProductosPage } from '../../../src/pages/pedidos/PedidosProductosPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';


// Mocks de dependencias externas
jest.mock('../../../src/api/pedidos.api', () => ({
  getAllPedidosProductos: jest.fn(),
  getPedido: jest.fn(),
  send_cancel_mail: jest.fn(),
  deletePedido: jest.fn(),
  updatePedido: jest.fn()
}));

jest.mock('../../../src/api/products.api', () => ({
  getProduct: jest.fn()
}));

jest.mock('../../../src/api/users.api', () => ({
  getUser: jest.fn()
}));

jest.mock('../../../src/components/pedidos/PedidoProductoCard', () => ({
  PedidoProductoCard: ({ productId, cantidad }) => (
    <div data-testid="producto">Producto {productId} x {cantidad}</div>
  )
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

const pedidosApi = require('../../../src/api/pedidos.api');
const productsApi = require('../../../src/api/products.api');
const usersApi = require('../../../src/api/users.api');

const renderWithRouter = (route) => {
  window.history.pushState({}, 'Test page', route);

  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/pedidos/:id/:iduser" element={<PedidosProductosPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PedidosProductosPage', () => {
  beforeEach(() => {
    pedidosApi.getAllPedidosProductos.mockResolvedValue({ data: [
      { pedido_ppid: '1', producto_ppid: '101', cantidad_producto_carrito: 2 }
    ] });

    productsApi.getProduct.mockResolvedValue({ data: { precio: 1000 } });
    pedidosApi.getPedido.mockResolvedValue({ data: {
      estado_pedido: false,
      metodo_pago: 'Efectivo',
      direccion: 'Calle Falsa 123',
      hora: '12:00',
      fecha: '2023-01-01',
      usuarios: [],
      productos: []
    }});

    usersApi.getUser.mockResolvedValue({ data: { email: 'test@example.com' } });
  });

  it('renderiza los productos y calcula el total correctamente', async () => {
    renderWithRouter('/pedidos/1/42');

    expect(await screen.findByText(/Producto 101 x 2/i)).toBeInTheDocument();
    expect(await screen.findByTestId('total-precio')).toHaveTextContent('TOTAL PEDIDO: $2000');

  });

  it('permite marcar el pedido como entregado', async () => {
    renderWithRouter('/pedidos/1/42');

    const checkbox = await screen.findByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(pedidosApi.updatePedido).toHaveBeenCalledWith('1', expect.objectContaining({ estado_pedido: true }));
    });
  });

  it('permite cancelar el pedido', async () => {
    renderWithRouter('/pedidos/1/42');

    const button = await screen.findByRole('button', { name: /cancelar pedido/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(pedidosApi.send_cancel_mail).toHaveBeenCalledWith('test@example.com', expect.any(String));
      expect(pedidosApi.deletePedido).toHaveBeenCalledWith('1');
    });
  });

  it('muestra errores si getAllPedidosProductos falla', async () => {
    pedidosApi.getAllPedidosProductos.mockRejectedValueOnce(new Error('Network error'));
    renderWithRouter('/pedidos/1/42');
    await waitFor(() => {
      expect(pedidosApi.getAllPedidosProductos).toHaveBeenCalled();
    });
  });
  
});



