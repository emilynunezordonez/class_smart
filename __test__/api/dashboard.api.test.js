import axios from 'axios';
import {
  productosMasVendidos,
  indicadoresUsuario,
  ventasDiarias,
  metodosPMasUtilizados,
  tablaProductosMasVendidos,
  valorTotalVentas,
  estadosPedidos
} from '../../src/api/dashboard.api'; 

jest.mock('axios');

describe('Dashboard API requests', () => {
  const mockGet = axios.get;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('authToken', 'test-token');
  });

  const expectedHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token test-token'
    }
  };

  it('debería obtener productos más vendidos', async () => {
    mockGet.mockResolvedValue({ data: ['prod1', 'prod2'] });
    const response = await productosMasVendidos();
    expect(mockGet).toHaveBeenCalledWith('api/productos_mas_vendidos', expectedHeaders);
    expect(response.data).toEqual(['prod1', 'prod2']);
  });

  it('debería obtener indicadores por usuario', async () => {
    mockGet.mockResolvedValue({ data: { usuarios: 5 } });
    const response = await indicadoresUsuario();
    expect(mockGet).toHaveBeenCalledWith('api/indicadores_por_usuario', expectedHeaders);
    expect(response.data.usuarios).toBe(5);
  });

  it('debería obtener ventas diarias', async () => {
    mockGet.mockResolvedValue({ data: [10, 20] });
    const response = await ventasDiarias();
    expect(mockGet).toHaveBeenCalledWith('api/ventas_diarias', expectedHeaders);
    expect(response.data).toEqual([10, 20]);
  });

  it('debería obtener métodos de pago más utilizados', async () => {
    mockGet.mockResolvedValue({ data: ['Tarjeta', 'Efectivo'] });
    const response = await metodosPMasUtilizados();
    expect(mockGet).toHaveBeenCalledWith('api/metodos_pago_mas_utilizados', expectedHeaders);
    expect(response.data).toContain('Tarjeta');
  });

  it('debería obtener tabla de productos más vendidos', async () => {
    mockGet.mockResolvedValue({ data: [{ producto: 'A', ventas: 100 }] });
    const response = await tablaProductosMasVendidos();
    expect(mockGet).toHaveBeenCalledWith('api/productosMasVendidos', expectedHeaders);
    expect(response.data[0].producto).toBe('A');
  });

  it('debería obtener valor total de ventas', async () => {
    mockGet.mockResolvedValue({ data: { total: 1234.56 } });
    const response = await valorTotalVentas();
    expect(mockGet).toHaveBeenCalledWith('api/valor_total_ventas', expectedHeaders);
    expect(response.data.total).toBeCloseTo(1234.56);
  });

  it('debería obtener estados de pedidos', async () => {
    mockGet.mockResolvedValue({ data: { pendientes: 3, entregados: 7 } });
    const response = await estadosPedidos();
    expect(mockGet).toHaveBeenCalledWith('api/pedidos_por_estado', expectedHeaders);
    expect(response.data.entregados).toBe(7);
  });
});
