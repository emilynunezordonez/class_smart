import React from 'react'
import "@testing-library/jest-dom";
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ClientPage } from '../../../src/pages/cliente/ClientPage'

// filepath: /home/eminuor200441/GitHub/class_smart/__test__/pages/cliente/ClientPage.test.jsx

// Mock the Navigation and ClientList components
jest.mock('../../../src/components/cliente/Navigation', () => ({
    Navigation: () => <nav data-testid="navigation">Navigation</nav>
}))
jest.mock('../../../src/components/cliente/ClientList', () => ({
    ClientList: ({ searchCriteria, searchValue }) => (
        <div data-testid="client-list">
            {searchCriteria && <span>Criteria: {searchCriteria}</span>}
            {searchValue && <span>Value: {searchValue}</span>}
        </div>
    )
}))

describe('ClientPage', () => {
    it('renders Navigation and ClientList components', () => {
        render(
            <MemoryRouter initialEntries={['/clientes']}>
                <Routes>
                    <Route path="/clientes" element={<ClientPage />} />
                </Routes>
            </MemoryRouter>
        )
        expect(screen.getByTestId('navigation')).toBeInTheDocument()
        expect(screen.getByTestId('client-list')).toBeInTheDocument()
    })

    it('passes searchCriteria and searchValue from params to ClientList', () => {
        render(
            <MemoryRouter initialEntries={['/clientes/criteria1/value1']}>
                <Routes>
                    <Route path="/clientes/:criteria/:value" element={<ClientPage />} />
                </Routes>
            </MemoryRouter>
        )
        expect(screen.getByText(/Criteria: criteria1/)).toBeInTheDocument()
        expect(screen.getByText(/Value: value1/)).toBeInTheDocument()
    })

    it('renders ClientList without criteria and value if params are missing', () => {
        render(
            <MemoryRouter initialEntries={['/clientes']}>
                <Routes>
                    <Route path="/clientes" element={<ClientPage />} />
                </Routes>
            </MemoryRouter>
        )
        const clientList = screen.getByTestId('client-list')
        expect(clientList).toBeInTheDocument()
        expect(clientList.textContent).toBe('')
    })
})