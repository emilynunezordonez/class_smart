import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Bancos from '../../../../src/components/cliente/metodos_pago/Bancos'
import { MemoryRouter } from 'react-router-dom'

// filepath: /home/eminuor200441/GitHub/class_smart/__test__/components/cliente/metodos_pago/Bancos.test.jsx

// Mock images to avoid import errors
jest.mock('../../../../src/images/bancolombia.png', () => 'bancolombia.png')
jest.mock('../../../../src/images/nequi.png', () => 'nequi.png')
jest.mock('../../../../src/images/bancoBogota.png', () => 'bancoBogota.png')
jest.mock('../../../../src/images/davivienda.jpg', () => 'davivienda.jpg')

// Mock useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}))

// Mock authService
const mockHacerCompra = jest.fn(() => 'compra realizada')
jest.mock('../../../../src/services/authService', () => ({
    authService: {
        HacerCompra: (...args) => mockHacerCompra(...args),
    },
}))

describe('Bancos component', () => {
    const userP = { id: 1, name: 'Test User' }
    const formD = { amount: 100 }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the select and images', () => {
        render(<Bancos userP={userP} formD={formD} />, { wrapper: MemoryRouter })
        expect(screen.getByText(/Elige tu Banco/i)).toBeInTheDocument()
        expect(screen.getByRole('combobox')).toBeInTheDocument()
        expect(screen.getByAltText('bancolombia')).toBeInTheDocument()
        expect(screen.getByAltText('nequi')).toBeInTheDocument()
        expect(screen.getByAltText('bancoBogota')).toBeInTheDocument()
        expect(screen.getByAltText('davivienda')).toBeInTheDocument()
    })

    it('calls HacerCompra and navigates on submit', () => {
        render(<Bancos userP={userP} formD={formD} />, { wrapper: MemoryRouter })
        const button = screen.getByRole('button', { name: /ir a Pagar/i })
        window.open = jest.fn()
        fireEvent.click(button)
        expect(mockHacerCompra).toHaveBeenCalledWith(formD, userP)
        expect(window.open).toHaveBeenCalledWith(expect.stringContaining('bancolombia'))
        expect(mockNavigate).toHaveBeenCalledWith('/client')
    })

    it('opens Nequi URL when Nequi is selected', () => {
        render(<Bancos userP={userP} formD={formD} />, { wrapper: MemoryRouter })
        window.open = jest.fn()
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'nequi' } })
        fireEvent.click(screen.getByRole('button', { name: /ir a Pagar/i }))
        expect(window.open).toHaveBeenCalledWith('https://transacciones.nequi.com/bdigital/login.jsp')
        expect(mockNavigate).toHaveBeenCalledWith('/client')
    })

    it('opens Banco de Bogota URL when Banco de Bogota is selected', () => {
        render(<Bancos userP={userP} formD={formD} />, { wrapper: MemoryRouter })
        window.open = jest.fn()
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'bancoBogota' } })
        fireEvent.click(screen.getByRole('button', { name: /ir a Pagar/i }))
        expect(window.open).toHaveBeenCalledWith('https://virtual.bancodebogota.co/')
        expect(mockNavigate).toHaveBeenCalledWith('/client')
    })

    it('opens Davivienda URL when Davivienda is selected', () => {
        render(<Bancos userP={userP} formD={formD} />, { wrapper: MemoryRouter })
        window.open = jest.fn()
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'davivienda' } })
        fireEvent.click(screen.getByRole('button', { name: /ir a Pagar/i }))
        expect(window.open).toHaveBeenCalledWith(expect.stringContaining('davivienda.com'))
        expect(mockNavigate).toHaveBeenCalledWith('/client')
    })
})