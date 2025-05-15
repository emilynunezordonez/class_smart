import axios from 'axios';
import {
  getAllPedidos,
  getAllPedidosProductos,
  getPedido,
  getPedidoProducto,
  updatePedido,
  send_cancel_mail,
  deletePedido,
  createPedido,
  createPedidosProductos,
  llenarPedidosProductos,
  generarFacturaPedido
} from '../../src/api/pedidos.api';

jest.mock('axios');

describe('Pedidos API', () => {
  const mockGet = axios.get;
  const mockPost = axios.post;
  const mockPut = axios.put;
  const mockDelete = axios.delete;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('authToken', 'test-token');
  });

  const expectedHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token test-token',
    }
  };

  it('debería obtener todos los pedidos', async () => {
    mockGet.mockResolvedValue({ data: ['pedido1'] });
    const res = await getAllPedidos();
    expect(mockGet).toHaveBeenCalledWith('api/pedidos/', expectedHeaders);
    expect(res.data).toEqual(['pedido1']);
  });

  it('debería obtener todos los pedidos-productos', async () => {
    mockGet.mockResolvedValue({ data: ['pp1'] });
    const res = await getAllPedidosProductos();
    expect(mockGet).toHaveBeenCalledWith('api/pedidos_productos/', expectedHeaders);
    expect(res.data).toEqual(['pp1']);
  });

  it('debería obtener un pedido por ID', async () => {
    mockGet.mockResolvedValue({ data: { id: 1 } });
    const res = await getPedido(1);
    expect(mockGet).toHaveBeenCalledWith('api/pedidos/1/', expectedHeaders);
    expect(res.data.id).toBe(1);
  });

  it('debería obtener un pedido-producto por ID', async () => {
    mockGet.mockResolvedValue({ data: { id: 2 } });
    const res = await getPedidoProducto(2);
    expect(mockGet).toHaveBeenCalledWith('api/pedidos_productos/2/', expectedHeaders);
    expect(res.data.id).toBe(2);
  });

  it('debería actualizar un pedido', async () => {
    const pedido = { estado: 'procesado' };
    mockPut.mockResolvedValue({ data: pedido });
    const res = await updatePedido(1, pedido);
    expect(mockPut).toHaveBeenCalledWith('api/pedidos/1/', pedido, expectedHeaders);
    expect(res.data.estado).toBe('procesado');
  });

  it('debería enviar correo de cancelación', async () => {
    mockGet.mockResolvedValue({ data: 'ok' });
    const res = await send_cancel_mail('correo@dominio.com', 'mensaje');
    expect(mockGet).toHaveBeenCalledWith(
      'api/send_email_cancel/?dest=correo@dominio.com&mensaje=mensaje'
    );
    expect(res.data).toBe('ok');
  });

  it('debería eliminar un pedido', async () => {
    mockDelete.mockResolvedValue({ status: 204 });
    const res = await deletePedido(3);
    expect(mockDelete).toHaveBeenCalledWith('api/pedidos/3/', expectedHeaders);
    expect(res.status).toBe(204);
  });

  it('debería crear un pedido', async () => {
    const pedido = { cliente: 'Juan' };
    mockPost.mockResolvedValue({ data: pedido });
    const res = await createPedido(pedido);
    expect(mockPost).toHaveBeenCalledWith('api/pedidos/', pedido, expectedHeaders);
    expect(res.data.cliente).toBe('Juan');
  });

  it('debería crear pedidos-productos', async () => {
    const pp = [{ producto: 'A', cantidad: 2 }];
    mockPost.mockResolvedValue({ data: pp });
    const res = await createPedidosProductos(pp);
    expect(mockPost).toHaveBeenCalledWith('api/pedidos_productos/', pp, expectedHeaders);
    expect(res.data[0].producto).toBe('A');
  });

  it('debería llenar tabla de productos-pedidos', async () => {
    const lista = [{ producto: 'B' }];
    mockPost.mockResolvedValue({ data: lista });
    const res = await llenarPedidosProductos(lista);
    expect(mockPost).toHaveBeenCalledWith('api/llenarTablaProductosPedidos', lista, expectedHeaders);
    expect(res.data[0].producto).toBe('B');
  });

  it('debería generar factura de un pedido', async () => {
    mockGet.mockResolvedValue({ data: 'PDF_URL' });
    const res = await generarFacturaPedido(5);
    expect(mockGet).toHaveBeenCalledWith('api/generar_factura/?pedido_id=5', expectedHeaders);
    expect(res.data).toBe('PDF_URL');
  });
});
