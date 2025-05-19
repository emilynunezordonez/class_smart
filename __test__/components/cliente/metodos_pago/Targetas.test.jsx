import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Targetas from '../../../../src/components/cliente/metodos_pago/Targetas'
import { BrowserRouter } from 'react-router-dom'

// filepath: /home/eminuor200441/GitHub/class_smart/__test__/components/cliente/metodos_pago/Targetas.test.jsx

// Mock images to avoid import errors
jest.mock('../../../../src/images/visa.jpg', () => 'visa.jpg')
jest.mock('../../../../src/images/mastercard.jpg', () => 'mastercard.jpg')
jest.mock('../../../../src/images/dinersclub.png', () => 'dinersclub.png')
jest.mock('../../../../src/images/americanexpress.png', () => 'americanexpress.png')

// Mock toast
jest.mock('react-hot-toast', () => ({
    __esModule: true,
    default: { success: jest.fn() }
}))

// Mock useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}))

// Mock authService
const mockHacerCompra = jest.fn(() => ({ data: 'mocked data' }))
jest.mock('../../../../src/services/authService', () => ({
    authService: {
        HacerCompra: (...args) => mockHacerCompra(...args)
    }
}))

const userP = { id: 1, name: 'Test User' }
const formD = { product: 'Test Product', price: 100 }
// --- EXTRA TESTS ---

it('changes card option in select', () => {
    renderComponent()
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'visa' } })
    expect(select.value).toBe('visa')
    fireEvent.change(select, { target: { value: 'dinersclub' } })
    expect(select.value).toBe('dinersclub')
})

it('should submit if only required fields are filled (no expiration date)', async () => {
    renderComponent()
    fireEvent.click(screen.getByText(/ir a Pagar/i))
    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'OnlyRequired' } })
    fireEvent.change(screen.getByPlaceholderText(/Country/i), { target: { value: 'Chile' } })
    fireEvent.change(screen.getByPlaceholderText(/1234 1234 1234 1234/i), { target: { value: '4111111111111111' } })
    fireEvent.change(screen.getByPlaceholderText(/CVC/i), { target: { value: '123' } })
    // Do not fill expiration date
    fireEvent.click(screen.getByText(/^Pagar$/i))
    await waitFor(() => {
        expect(mockHacerCompra).toHaveBeenCalledWith(formD, userP)
        expect(mockNavigate).toHaveBeenCalledWith('/client')
    })
})

it('should submit if all fields are filled', async () => {
    renderComponent()
    fireEvent.click(screen.getByText(/ir a Pagar/i))
    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'AllFields' } })
    fireEvent.change(screen.getByPlaceholderText(/Country/i), { target: { value: 'Mexico' } })
    fireEvent.change(screen.getByPlaceholderText(/1234 1234 1234 1234/i), { target: { value: '4111111111111111' } })
    fireEvent.change(screen.getByPlaceholderText(/CVC/i), { target: { value: '321' } })
    const dateInput = document.querySelector('input[type="date"]')
    fireEvent.change(dateInput, { target: { value: '2028-12-31' } })
    fireEvent.click(screen.getByText(/^Pagar$/i))
    await waitFor(() => {
        expect(mockHacerCompra).toHaveBeenCalledWith(formD, userP)
        expect(mockNavigate).toHaveBeenCalledWith('/client')
    })
})

it('should not open PayPal if all fields are empty', () => {
    renderComponent()
    fireEvent.click(screen.getByText(/ir a Pagar/i))
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {})
    fireEvent.click(screen.getByText(/PayPal/i))
    expect(openSpy).not.toHaveBeenCalled()
    openSpy.mockRestore()
})

it('should open PayPal if at least one field is filled', () => {
    renderComponent()
    fireEvent.click(screen.getByText(/ir a Pagar/i))
    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'X' } })
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {})
    fireEvent.click(screen.getByText(/PayPal/i))
    expect(openSpy).toHaveBeenCalledWith("https://www.paypal.com/signin?/myaccount/transfer/state")
    openSpy.mockRestore()
})

it('should keep form values after closing and reopening modal', () => {
    renderComponent()
    fireEvent.click(screen.getByText(/ir a Pagar/i))
    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'KeepMe' } })
    fireEvent.click(screen.getByText(/Cancelar/i))
    fireEvent.click(screen.getByText(/ir a Pagar/i))
    expect(screen.getByPlaceholderText(/Name/i).value).toBe('KeepMe')
})

it('should change card option and keep it after modal open/close', () => {
    renderComponent()
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'americanexpress' } })
    expect(select.value).toBe('americanexpress')
    fireEvent.click(screen.getByText(/ir a Pagar/i))
    fireEvent.click(screen.getByText(/Cancelar/i))
    expect(select.value).toBe('americanexpress')
})

it('should render all card images', () => {
    renderComponent()
    expect(screen.getByAltText(/visa/i)).toBeInTheDocument()
    expect(screen.getByAltText(/mastercard/i)).toBeInTheDocument()
    expect(screen.getByAltText(/dinersclub/i)).toBeInTheDocument()
    expect(screen.getByAltText(/americanexpress/i)).toBeInTheDocument()
})

it('should allow changing expiration date', () => {
    renderComponent()
    fireEvent.click(screen.getByText(/ir a Pagar/i))
    const dateInput = document.querySelector('input[type="date"]')
    fireEvent.change(dateInput, { target: { value: '2030-01-01' } })
    expect(dateInput.value).toBe('2030-01-01')
})

function renderComponent() {
    return render(
        <BrowserRouter>
            <Targetas userP={userP} formD={formD} />
        </BrowserRouter>
    )
}

describe('Targetas component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders credit card options and images', () => {
        renderComponent()
        expect(screen.getByText(/Elige tu Taregeta de Credito/i)).toBeInTheDocument()
        expect(screen.getByText(/Master Card/i)).toBeInTheDocument()
        expect(screen.getByAltText(/visa/i)).toBeInTheDocument()
        expect(screen.getByAltText(/mastercard/i)).toBeInTheDocument()
        expect(screen.getByAltText(/dinersclub/i)).toBeInTheDocument()
        expect(screen.getByAltText(/americanexpress/i)).toBeInTheDocument()
    })

    it('opens the payment form modal on "ir a Pagar" button click', () => {
        renderComponent()
        fireEvent.click(screen.getByText(/ir a Pagar/i))
        expect(screen.getByText(/Personal Information/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Country/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/1234 1234 1234 1234/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/CVC/i)).toBeInTheDocument()
    })

    it('closes the modal when Cancelar is clicked', () => {
        renderComponent()
        fireEvent.click(screen.getByText(/ir a Pagar/i))
        fireEvent.click(screen.getByText(/Cancelar/i))
        expect(screen.queryByText(/Personal Information/i)).not.toBeInTheDocument()
    })

    it('submits the payment form and calls HacerCompra, shows toast, and navigates', async () => {
        renderComponent()
        fireEvent.click(screen.getByText(/ir a Pagar/i))

        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'John Doe' } })
        fireEvent.change(screen.getByPlaceholderText(/Country/i), { target: { value: 'Colombia' } })
        fireEvent.change(screen.getByPlaceholderText(/1234 1234 1234 1234/i), { target: { value: '4111111111111111' } })
        fireEvent.change(screen.getByPlaceholderText(/CVC/i), { target: { value: '123' } })
        // Expiration date is optional in the UI

        fireEvent.click(screen.getByText(/^Pagar$/i))

        await waitFor(() => {
            expect(mockHacerCompra).toHaveBeenCalledWith(formD, userP)
            expect(mockNavigate).toHaveBeenCalledWith('/client')
        })
    })

    it('PayPal button opens PayPal in a new window if form is not empty', () => {
        renderComponent()
        fireEvent.click(screen.getByText(/ir a Pagar/i))

        // Fill at least one field
        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'John Doe' } })

        // Mock window.open
        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {})

        fireEvent.click(screen.getByText(/PayPal/i))

        expect(openSpy).toHaveBeenCalledWith("https://www.paypal.com/signin?/myaccount/transfer/state")
        openSpy.mockRestore()
    })

    it('PayPal button does not open PayPal if form is empty', () => {
        renderComponent()
        fireEvent.click(screen.getByText(/ir a Pagar/i))

        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {})

        fireEvent.click(screen.getByText(/PayPal/i))

        expect(openSpy).not.toHaveBeenCalled()
        openSpy.mockRestore()
    })
})