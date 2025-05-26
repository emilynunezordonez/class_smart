import React from 'react';
import { render, screen } from '@testing-library/react';
import { PedidosPage } from '../../../src/pages/pedidos/PedidosPage';

// Mock de los componentes usados
jest.mock('../../../src/components/pedidos/Navigation', () => ({
  Navigation: () => <div data-testid="navigation-mock">Navigation</div>,
}));

jest.mock('../../../src/components/pedidos/PedidosList', () => ({
  PedidosList: () => <div data-testid="pedidoslist-mock">PedidosList</div>,
}));

describe('PedidosPage', () => {
  it('renderiza Navigation y PedidosList correctamente', () => {
    render(<PedidosPage />);

    // Verifica que se rendericen ambos mocks
    expect(screen.getByTestId('navigation-mock')).toBeInTheDocument();
    expect(screen.getByTestId('pedidoslist-mock')).toBeInTheDocument();
  });
});
