import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PedidoProductoCard } from '../../../src/components/pedidos/PedidoProductoCard';
import { getProduct } from '../../../src/api/products.api';

// Mock de la API
jest.mock('../../../src/api/products.api', () => ({
  getProduct: jest.fn(),
}));

describe('PedidoProductoCard', () => {
  const mockProduct = {
    id: 1,
    nombre: 'Producto de prueba',
    precio: 19.99,
    descripcion: 'Descripción del producto',
    foto_producto: 'mock-image-url.jpg'
  };

  const mockProps = {
    productId: 1,
    cantidad: 3
  };

  beforeEach(() => {
    getProduct.mockResolvedValue({ data: mockProduct });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar "Loading..." mientras carga el producto', () => {
    getProduct.mockImplementation(() => new Promise(() => {}));
    render(<PedidoProductoCard {...mockProps} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('debería renderizar la información del producto correctamente', async () => {
    render(<PedidoProductoCard {...mockProps} />);
    await waitFor(() => {
      expect(screen.getByText(mockProduct.nombre)).toBeInTheDocument();

      // Buscar por texto fragmentado por etiquetas
      expect(
        screen.getByText((_, node) =>
          node.textContent.replace(/\s/g, '') === 'Cantidad:3'
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText((_, node) =>
          node.textContent.replace(/\s/g, '') === 'Precio:19.99'
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText((_, node) =>
          node.textContent.replace(/\s/g, '') === 'Descripción:Descripcióndelproducto'
        )
      ).toBeInTheDocument();

      const expectedTotal = (mockProps.cantidad * mockProduct.precio).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      expect(
        screen.getByText((_, node) =>
          node.textContent.replace(/\s/g, '') === `Total:$${expectedTotal.replace(/\s/g, '')}`
        )
      ).toBeInTheDocument();
    });
  });

  it('debería mostrar la imagen del producto si está disponible', async () => {
    render(<PedidoProductoCard {...mockProps} />);
    await waitFor(() => {
      const img = screen.getByAltText(mockProduct.nombre);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', mockProduct.foto_producto);
      expect(img).toHaveClass('w-32', 'h-[120px]', 'object-cover');
    });
  });

  it('debería manejar correctamente el caso sin imagen', async () => {
    const productWithoutImage = { ...mockProduct, foto_producto: null };
    getProduct.mockResolvedValue({ data: productWithoutImage });

    render(<PedidoProductoCard {...mockProps} />);

    await waitFor(() => {
      expect(screen.queryByAltText(mockProduct.nombre)).not.toBeInTheDocument();
    });
  });

  it('debería manejar errores al cargar el producto', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getProduct.mockRejectedValue(new Error('Error de API'));

    render(<PedidoProductoCard {...mockProps} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching product:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('debería formatear correctamente el precio total', async () => {
    const productWithDecimalPrice = { 
      ...mockProduct, 
      precio: 19.9567 
    };
    getProduct.mockResolvedValue({ data: productWithDecimalPrice });

    render(<PedidoProductoCard {...mockProps} />);

    await waitFor(() => {
      const expectedTotal = (mockProps.cantidad * productWithDecimalPrice.precio)
        .toLocaleString('es-ES', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
      expect(
        screen.getByText((_, node) =>
          node.textContent.replace(/\s/g, '') === `Total:$${expectedTotal.replace(/\s/g, '')}`
        )
      ).toBeInTheDocument();
    });
  });

  it('debería aplicar las clases CSS correctamente', async () => {
    render(<PedidoProductoCard {...mockProps} />);
    await waitFor(() => {
      // Seleccionamos el contenedor principal a través de su contenido único
      const card = screen.getByText(mockProduct.nombre).closest('div');
      expect(card).toHaveClass('bg-gray-100');
      expect(card).toHaveClass('hover:bg-gray-300');
      expect(card).toHaveClass('hover:cursor-pointer');
      expect(card).toHaveClass('m-4');
    });
  });
});