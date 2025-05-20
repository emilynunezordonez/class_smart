import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Nosotros } from "../../../src/pages/cliente/Nosotros";
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../../../src/components/cliente/Navigation';

// Mock de las dependencias
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../../src/components/cliente/Navigation', () => ({
  Navigation: () => <div data-testid="navigation">Navigation</div>
}));

jest.mock('../../assets/logo/clasSmart.png', () => 'mock-logo-path');

describe('Nosotros', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar correctamente todos los elementos', () => {
    render(<Nosotros />);

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByAltText('ClasSmart Logo')).toBeInTheDocument();
    expect(screen.getByText('ClasSmart')).toBeInTheDocument();
    expect(screen.getByText('Sobre Nosotros')).toBeInTheDocument();
    expect(screen.getByText(/Bienvenido a ClasSmart/)).toBeInTheDocument();
    expect(screen.getByText(/Además de contar con una gran cantidad/)).toBeInTheDocument();
    expect(screen.getByText(/Salomé Acosta Montaño/)).toBeInTheDocument();
  });

  it('debería llamar a useNavigate al montarse', () => {
    render(<Nosotros />);
    expect(useNavigate).toHaveBeenCalled();
  });

  it('debería navegar a /client al hacer clic en el botón Back', () => {
    render(<Nosotros />);
    
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/client');
  });

  it('debería tener el SVG de flecha en el botón Back', () => {
    render(<Nosotros />);
    
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });

  it('debería mostrar correctamente la lista de desarrolladores', () => {
    render(<Nosotros />);
    
    const developersText = screen.getByText(/Fui desarrollado por:/);
    expect(developersText).toBeInTheDocument();
    
    const fullText = screen.getByText(/Salomé Acosta Montaño.*Victoria Andrea Volveras Parra/s);
    expect(fullText).toBeInTheDocument();
  });

  it('debería aplicar las clases CSS correctamente', () => {
    render(<Nosotros />);
    
    const mainTitle = screen.getByText('ClasSmart');
    expect(mainTitle).toHaveClass('hover:scale-110');
    
    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toHaveClass('hover:text-gray-900');
  });
});