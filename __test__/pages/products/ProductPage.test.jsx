import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductPage } from '../../../src/pages/products/ProductPage';
import { ProductList } from '../../../src/components/products/ProductList';
import { Navigation } from '../../../src/components/products/Navigation';
import { useParams } from 'react-router-dom';

// Mock react-router-dom useParams
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

// Mock components ProductList y Navigation (si quieres evitar render completo)
jest.mock('../../../src/components/products/ProductList', () => ({
  ProductList: jest.fn(() => <div data-testid="mock-product-list" />),
}));
jest.mock('../../../src/components/products/Navigation', () => ({
  Navigation: jest.fn(() => <nav data-testid="mock-navigation" />),
}));

describe('ProductPage', () => {
  it('renderiza Navigation y ProductList con params vacíos', () => {
    useParams.mockReturnValue({}); // sin params

    render(<ProductPage />);

    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-product-list')).toBeInTheDocument();

    // ProductList debe recibir props vacíos o undefined
    expect(ProductList).toHaveBeenCalledWith(
      expect.objectContaining({ searchCriteria: undefined, searchValue: undefined }),
      {}
    );
  });

  it('renderiza ProductList con params específicos', () => {
    useParams.mockReturnValue({ criteria: 'category', value: 'fruits' });

    render(<ProductPage />);

    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-product-list')).toBeInTheDocument();

    expect(ProductList).toHaveBeenCalledWith(
      expect.objectContaining({ searchCriteria: 'category', searchValue: 'fruits' }),
      {}
    );
  });
});
