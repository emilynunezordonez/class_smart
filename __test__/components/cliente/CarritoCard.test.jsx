import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CarritoCard } from '../../../src/components/cliente/CarritoCard';
import { useNavigate } from 'react-router-dom';
import { updateCantidadProductoCarrito } from '../../../src/api/products.api';
// Mock de las dependencias
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../src/api/products.api', () => ({
  updateCantidadProductoCarrito: jest.fn().mockResolvedValue({ data: {} }),
}));

describe('CarritoCard', () => {
  const mockProduct = {
    id_user_product: 1,
    id: 1,
    nombre: 'Producto de prueba',
    descripcion: 'Descripción de prueba',
    precio: 100,
    cantidad_user_producto: 2,
    cantidad_producto: 5,
    foto_producto: 'test.jpg',
  };

  const mockSetTotal = jest.fn();
  const mockTotal = 200;
  const mockNavigate = jest.fn();

  beforeAll(() => {
    // Mock completo para localStorage
    global.Storage.prototype.setItem = jest.fn();
    global.Storage.prototype.getItem = jest.fn();
  });

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
    updateCantidadProductoCarrito.mockResolvedValue({ data: {} });
    global.Storage.prototype.setItem.mockClear();
    global.Storage.prototype.getItem.mockImplementation((key) => {
      return key === 'total' ? mockTotal.toString() : null;
    });
  });

  it('renderiza correctamente el producto', () => {
    render(<CarritoCard product={mockProduct} set_total={mockSetTotal} Total={mockTotal} />);
    expect(screen.getByText('Producto de prueba')).toBeInTheDocument();
    expect(screen.getByText('Descripción: Descripción de prueba')).toBeInTheDocument();
    expect(screen.getByText(/Precio: \$100(\.00)?/)).toBeInTheDocument();
    expect(screen.getByText('Cantidad a comprar: 2')).toBeInTheDocument();
    expect(screen.getByText('Cantidad disponible: 5')).toBeInTheDocument();
    expect(screen.getByText(/Total: \$200(\.00)?/)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test.jpg');
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('formatea correctamente precios con decimales', () => {
    const productConDecimales = { 
      ...mockProduct, 
      precio: 99.99 
    };
    render(<CarritoCard product={productConDecimales} set_total={mockSetTotal} Total={mockTotal} />);
    expect(screen.getByText(/Precio: \$99[,.]99/)).toBeInTheDocument();
  });

  describe('handlePlus', () => {
    it('actualiza el total y localStorage al incrementar', async () => {
      updateCantidadProductoCarrito.mockResolvedValue({ data: { cantidad_producto: 3 } });
      render(<CarritoCard product={mockProduct} set_total={mockSetTotal} Total={mockTotal} />);
      await act(async () => {
        fireEvent.click(screen.getByText('+'));
      });
      const expectedTotal = mockTotal + mockProduct.precio; // 200 + 100 = 300
      expect(mockSetTotal).toHaveBeenCalledWith(expectedTotal);
      // El componente guarda el valor anterior, no el nuevo, en localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('total', mockTotal);
    });

    it('no incrementa si no hay stock disponible', async () => {
      const productSinStock = { ...mockProduct, cantidad_producto: 0 };
      render(<CarritoCard product={productSinStock} set_total={mockSetTotal} Total={mockTotal} />);
      await act(async () => {
        fireEvent.click(screen.getByText('+'));
      });
      expect(mockSetTotal).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('handleSub', () => {
    it('decrementa la cantidad cuando hay cantidad mayor a 0', async () => {
      const mockResponse = { data: { cantidad_producto: 1 } };
      updateCantidadProductoCarrito.mockResolvedValue(mockResponse);
      render(<CarritoCard product={mockProduct} set_total={mockSetTotal} Total={mockTotal} />);
      await act(async () => {
        fireEvent.click(screen.getByText('-'));
      });
      expect(updateCantidadProductoCarrito).toHaveBeenCalledWith(1, 1);
    });

    it('no decrementa la cantidad cuando la cantidad es 0', async () => {
      const productSinCantidad = { ...mockProduct, cantidad_user_producto: 0 };
      render(<CarritoCard product={productSinCantidad} set_total={mockSetTotal} Total={mockTotal} />);
      await act(async () => {
        fireEvent.click(screen.getByText('-'));
      });
      expect(updateCantidadProductoCarrito).not.toHaveBeenCalled();
    });

    it('actualiza el total al decrementar', async () => {
      const mockResponse = { data: { cantidad_producto: 1 } };
      updateCantidadProductoCarrito.mockResolvedValue(mockResponse);
      render(<CarritoCard product={mockProduct} set_total={mockSetTotal} Total={mockTotal} />);
      await act(async () => {
        fireEvent.click(screen.getByText('-'));
      });
      expect(mockSetTotal).toHaveBeenCalledWith(mockTotal - mockProduct.precio);
      expect(localStorage.setItem).toHaveBeenCalledWith('total', mockTotal);
    });
  });

  it('maneja errores al actualizar cantidades', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    updateCantidadProductoCarrito.mockRejectedValue(new Error('Error de prueba'));
    render(<CarritoCard product={mockProduct} set_total={mockSetTotal} Total={mockTotal} />);
    await act(async () => {
      fireEvent.click(screen.getByText('+'));
    });
    expect(consoleSpy).toHaveBeenCalledWith('Error al actualizar cantidades', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('no navega al hacer click en el nombre del producto si no está implementado', () => {
    render(<CarritoCard product={mockProduct} set_total={mockSetTotal} Total={mockTotal} />);
    fireEvent.click(screen.getByText('Producto de prueba'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('muestra correctamente el producto sin imagen', () => {
    const productSinImagen = { ...mockProduct, foto_producto: undefined };
    render(<CarritoCard product={productSinImagen} set_total={mockSetTotal} Total={mockTotal} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  // TESTS ADICIONALES

  it('no llama a set_total ni localStorage si cantidad_user_producto es 0 al decrementar', async () => {
    const productSinCantidad = { ...mockProduct, cantidad_user_producto: 0 };
    render(<CarritoCard product={productSinCantidad} set_total={mockSetTotal} Total={mockTotal} />);
    await act(async () => {
      fireEvent.click(screen.getByText('-'));
    });
    expect(mockSetTotal).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('muestra correctamente el total calculado con cantidad diferente', () => {
    const productCantidad = { ...mockProduct, cantidad_user_producto: 3, precio: 50 };
    render(<CarritoCard product={productCantidad} set_total={mockSetTotal} Total={mockTotal} />);
    expect(screen.getByText(/Total: \$150(\.00)?/)).toBeInTheDocument();
  });

  it('muestra correctamente el precio y total con decimales', () => {
  const productDec = { ...mockProduct, precio: 123.45, cantidad_user_producto: 2 };
  render(<CarritoCard product={productDec} set_total={mockSetTotal} Total={mockTotal} />);
  // Verifica que exista al menos un elemento con el precio formateado
  expect(
    screen.getAllByText((content, node) =>
      node.textContent.replace(/\s/g, '').includes('Precio:$123,45') ||
      node.textContent.replace(/\s/g, '').includes('Precio:$123.45')
    ).length
  ).toBeGreaterThan(0);
  // Verifica que exista al menos un elemento con el total formateado
  expect(
    screen.getAllByText((content, node) =>
      node.textContent.replace(/\s/g, '').includes('Total:$246,9') ||
      node.textContent.replace(/\s/g, '').includes('Total:$246.90') ||
      node.textContent.replace(/\s/g, '').includes('Total:$246,90')
    ).length
  ).toBeGreaterThan(0);
});

  it('no llama a set_total ni localStorage si cantidad_producto es 0 al incrementar', async () => {
    const productSinStock = { ...mockProduct, cantidad_producto: 0 };
    render(<CarritoCard product={productSinStock} set_total={mockSetTotal} Total={mockTotal} />);
    await act(async () => {
      fireEvent.click(screen.getByText('+'));
    });
    expect(mockSetTotal).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('renderiza correctamente si no hay descripción', () => {
    const productSinDesc = { ...mockProduct, descripcion: undefined };
    render(<CarritoCard product={productSinDesc} set_total={mockSetTotal} Total={mockTotal} />);
    expect(screen.getByText('Descripción:')).toBeInTheDocument();
  });

  //Adicionales
  it('maneja error en handlePlus', async () => {
    updateCantidadProductoCarrito.mockRejectedValueOnce(new Error('error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<CarritoCard product={mockProduct} set_total={mockSetTotal} Total={mockTotal} />);
    await act(async () => {
      fireEvent.click(screen.getByText('+'));
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('maneja error en handleSub', async () => {
    updateCantidadProductoCarrito.mockRejectedValueOnce(new Error('error'));
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<CarritoCard product={mockProduct} set_total={mockSetTotal} Total={mockTotal} />);
    await act(async () => {
      fireEvent.click(screen.getByText('-'));
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});