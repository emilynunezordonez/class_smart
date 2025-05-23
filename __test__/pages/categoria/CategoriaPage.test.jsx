import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategoriaPage } from '../../../src/pages/categoria/CategoriaPage';

// Mocks de los componentes hijos
jest.mock('../../../src/components/categoria/Navigation', () => ({
  Navigation: () => <nav data-testid="navigation">Mock Navigation</nav>
}));
jest.mock('../../../src/components/categoria/CategoriasList', () => ({
  CategoriasList: () => <div data-testid="categorias-list">Mock CategoriasList</div>
}));

describe('CategoriaPage', () => {
  it('renderiza Navigation y CategoriasList', () => {
    render(<CategoriaPage />);
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('categorias-list')).toBeInTheDocument();
  });

  it('tiene la estructura de layout esperada', () => {
    render(<CategoriaPage />);
    // Verifica que el contenedor principal existe
    expect(screen.getByTestId('categorias-list').parentElement).toHaveClass('container', 'mx-auto', 'mt-4', 'text-black');
  });
});