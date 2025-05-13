import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { ProductCard } from '../../../src/components/products/ProductCard.jsx';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

describe('ProductCard', () => {
  test('se renderiza sin errores', () => {
    const product = {
      id: 1,
      nombre: 'Producto Test',
      precio: 10,
      cantidad_producto: 2,
      descripcion: 'Descripción',
      foto_producto: 'https://via.placeholder.com/150',
    };

    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    );
  });
});
