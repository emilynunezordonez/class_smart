import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NavigationCar } from '../../../src/components/cliente/NavigationCar';
import * as productsApi from '../../../src/api/products.api';
import { BrowserRouter } from 'react-router-dom';
import toast from 'react-hot-toast';

// filepath: /home/eminuor200441/GitHub/class_smart/__test__/components/cliente/NavigationCar.test.jsx

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
    __esModule: true,
    default: {
        success: jest.fn(),
        error: jest.fn(),
    },
    success: jest.fn(),
    error: jest.fn(),
}));

// Mock ShoppingCart icon
jest.mock('lucide-react', () => ({
    ShoppingCart: () => <div data-testid="shopping-cart-icon" />,
}));

describe('NavigationCar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('user_id', 'test-user');
    });

    it('renders the component and static texts', async () => {
        jest.spyOn(productsApi, 'searchUserProducts').mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <NavigationCar total_global={0} />
            </BrowserRouter>
        );

        expect(screen.getByText('Tu carrito de compras')).toBeInTheDocument();
        expect(screen.getByText('Comprar')).toBeInTheDocument();
        expect(screen.getByText('Vaciar carrito')).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument();
    });

    it('calls navigate to /client when Back button is clicked', async () => {
        jest.spyOn(productsApi, 'searchUserProducts').mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <NavigationCar total_global={0} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Back'));
        expect(mockNavigate).toHaveBeenCalledWith('/client');
    });

    it('shows error toast when Comprar is clicked and no products', async () => {
        jest.spyOn(productsApi, 'searchUserProducts').mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <NavigationCar total_global={0} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Comprar'));
        expect(toast.error).toHaveBeenCalledWith('No hay productos para comprar', expect.any(Object));
        expect(mockNavigate).not.toHaveBeenCalledWith('/pasarela');
    });

    it('navigates to /pasarela when Comprar is clicked and there are products', async () => {
        jest.spyOn(productsApi, 'searchUserProducts').mockResolvedValue({ data: [{ id: 1 }] });

        render(
            <BrowserRouter>
                <NavigationCar total_global={0} />
            </BrowserRouter>
        );

        // Wait for useEffect to set hayProductos to true
        await waitFor(() => {
            // Click Comprar
            fireEvent.click(screen.getByText('Comprar'));
            expect(mockNavigate).toHaveBeenCalledWith('/pasarela');
        });
    });

    it('calls vaciarCarrito and shows toast when Vaciar carrito is clicked', async () => {
        jest.spyOn(productsApi, 'searchUserProducts').mockResolvedValue({ data: [{ id: 1 }] });
        const vaciarCarritoMock = jest.spyOn(productsApi, 'vaciarCarrito').mockResolvedValue({ data: 'ok' });
        jest.useFakeTimers();
        jest.spyOn(global, 'location', 'get').mockReturnValue({ reload: jest.fn() });

        render(
            <BrowserRouter>
                <NavigationCar total_global={0} />
            </BrowserRouter>
        );

        // Wait for useEffect to set hayProductos to true
        await waitFor(() => expect(screen.getByText('Vaciar carrito')).toBeEnabled());

        fireEvent.click(screen.getByText('Vaciar carrito'));
        jest.runAllTimers();

        await waitFor(() => {
            expect(vaciarCarritoMock).toHaveBeenCalledWith('test-user');
            expect(toast.success).toHaveBeenCalledWith('Carrito vaciado exitosamente', expect.any(Object));
        });
    });

    // Test for line 34: location.reload() is called after vaciarCarrito
    // ...existing code...
    it('calls location.reload after vaciarCarrito', async () => {
        jest.spyOn(productsApi, 'searchUserProducts').mockResolvedValue({ data: [{ id: 1 }] });
        jest.spyOn(productsApi, 'vaciarCarrito').mockResolvedValue({ data: 'ok' });
        jest.useFakeTimers();

        const reloadMock = jest.fn();
        const originalLocation = global.location;
        delete global.location;
        global.location = { reload: reloadMock };

        render(
            <BrowserRouter>
                <NavigationCar total_global={0} />
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.getByText('Vaciar carrito')).toBeEnabled());
        fireEvent.click(screen.getByText('Vaciar carrito'));
        jest.runAllTimers();

        // Espera explícitamente a que reloadMock sea llamado
        await waitFor(() => {
            expect(reloadMock).toHaveBeenCalled();
        }, { timeout: 3000 });

        global.location = originalLocation;
    });
// ...existing code...

    // Extra: test that Comprar button does not navigate if hayProductos is false
    it('does not navigate to /pasarela if hayProductos is false', async () => {
        jest.spyOn(productsApi, 'searchUserProducts').mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <NavigationCar total_global={0} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Comprar'));
        expect(mockNavigate).not.toHaveBeenCalledWith('/pasarela');
    });

    // Extra: test that vaciarCarrito is not called if button is clicked with no products
});