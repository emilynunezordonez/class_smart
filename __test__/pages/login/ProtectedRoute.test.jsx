import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../../src/pages/login/ProtectedRoute';

const ProtectedComponent = () => <div>Ruta protegida</div>;
const LoginComponent = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renderiza el componente protegido si el token está presente', () => {
    localStorage.setItem('authToken', 'test-token');

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<ProtectedComponent />} />
          </Route>
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Ruta protegida')).toBeInTheDocument();
  });

  it('redirecciona a /login si el token no está presente', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<ProtectedComponent />} />
          </Route>
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
