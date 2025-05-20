import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Importación actualizada
import { MemoryRouter } from 'react-router-dom';
import PedidosClientePage from '../../../src/pages/cliente/PedidosClientePage';
import { searchUserProducts } from '../../../src/api/products.api';
import { authService } from '../../../src/services/authService';

// Mock de las dependencias
jest.mock('../../../src/api/products.api', () => ({
  searchUserProducts: jest.fn(),
}));

jest.mock('../../../src/services/authService', () => ({
  authService: {
    HacerCompra: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock de las imágenes
jest.mock('../../../src/images/bancolombia.png', () => 'mock-file-path');
jest.mock('../../../src/images/nequi.png', () => 'mock-file-path');
jest.mock('../../../src/images/bancoBogota.png', () => 'mock-file-path');
jest.mock('../../../src/images/davivienda.jpg', () => 'mock-file-path');
jest.mock('../../../src/images/visa.jpg', () => 'mock-file-path');
jest.mock('../../../src/images/mastercard.jpg', () => 'mock-file-path');
jest.mock('../../../src/images/dinersclub.png', () => 'mock-file-path');
jest.mock('../../../src/images/americanexpress.png', () => 'mock-file-path');
jest.mock('../../../src/images/efecti.jpeg', () => 'mock-file-path');

describe('PedidosClientePage', () => {
  const mockUserProducts = [
    { id: 1, nombre: 'Producto 1', precio: 100 },
    { id: 2, nombre: 'Producto 2', precio: 200 },
  ];

  const mockNavigate = jest.fn();

  beforeEach(() => {
    localStorage.setItem('user_id', '123');
    searchUserProducts.mockResolvedValue({ data: mockUserProducts });
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders correctly and fetches user products', async () => {
    render(
      <MemoryRouter>
        <PedidosClientePage />
      </MemoryRouter>
    );

    expect(searchUserProducts).toHaveBeenCalledWith('123');
    
    await waitFor(() => {
      expect(screen.getByText('Informacion de Pago')).toBeInTheDocument();
    });
  });

  it('handles form input changes', async () => {
    render(
      <MemoryRouter>
        <PedidosClientePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const direccionInput = screen.getByPlaceholderText('Direccion');
      fireEvent.change(direccionInput, { target: { value: 'Calle 123' } });
      expect(direccionInput).toHaveValue('Calle 123');
    });
  });

  it('handles payment method selection and form submission - Transferencia bancaria', async () => {
    render(
      <MemoryRouter>
        <PedidosClientePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'Transferencia bancaria' } });

      const direccionInput = screen.getByPlaceholderText('Direccion');
      fireEvent.change(direccionInput, { target: { value: 'Calle 123' } });

      const submitButton = screen.getByText('Siguiente');
      fireEvent.click(submitButton);
    });

    // Verificamos que el formulario inicial ya no está visible
    await waitFor(() => {
      expect(screen.queryByText('Informacion de Pago')).not.toBeInTheDocument();
    });
  });

  it('handles payment method selection and form submission - Tarjeta de credito', async () => {
    render(
      <MemoryRouter>
        <PedidosClientePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'Tarjeta de credito' } });

      const direccionInput = screen.getByPlaceholderText('Direccion');
      fireEvent.change(direccionInput, { target: { value: 'Calle 123' } });

      const submitButton = screen.getByText('Siguiente');
      fireEvent.click(submitButton);
    });

    // Verificamos que el formulario inicial ya no está visible
    await waitFor(() => {
      expect(screen.queryByText('Informacion de Pago')).not.toBeInTheDocument();
    });
  });

  it('handles payment method selection and form submission - Efecty', async () => {
    const mockWindowOpen = jest.fn();
    window.open = mockWindowOpen;

    render(
      <MemoryRouter>
        <PedidosClientePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'efecty' } });

      const direccionInput = screen.getByPlaceholderText('Direccion');
      fireEvent.change(direccionInput, { target: { value: 'Calle 123' } });

      const submitButton = screen.getByText('Siguiente');
      fireEvent.click(submitButton);
    });

    expect(authService.HacerCompra).toHaveBeenCalled();
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://www.efectyvirtual.com/PortalEcommerce/Account/Login?Geolocalizacion=%2F%2F'
    );
    expect(mockNavigate).toHaveBeenCalledWith('/client');
  });

  it('displays payment method logos', async () => {
    render(
      <MemoryRouter>
        <PedidosClientePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByAltText('bancolombia')).toBeInTheDocument();
      expect(screen.getByAltText('nequi')).toBeInTheDocument();
      expect(screen.getByAltText('bancoBogota')).toBeInTheDocument();
      expect(screen.getByAltText('davivienda')).toBeInTheDocument();
      expect(screen.getByAltText('visa')).toBeInTheDocument();
      expect(screen.getByAltText('mastercard')).toBeInTheDocument();
      expect(screen.getByAltText('dinersclub')).toBeInTheDocument();
      expect(screen.getByAltText('americanexpress')).toBeInTheDocument();
      expect(screen.getByAltText('efecty')).toBeInTheDocument();
    });
  });

  it('requires address field', async () => {
    render(
      <MemoryRouter>
        <PedidosClientePage />
      </MemoryRouter>
    );

    const direccionInput = screen.getByPlaceholderText('Direccion');
    expect(direccionInput).toBeRequired();

    await waitFor(() => {
      const submitButton = screen.getByText('Siguiente');
      fireEvent.click(submitButton);
      
      expect(direccionInput).toHaveAttribute('required');
    });
  });
});