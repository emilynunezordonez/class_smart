import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { Navigation } from "../../../src/components/categoria/Navigation";
import { getAllCategories } from "../../../src/api/categories.api";
import '@testing-library/jest-dom';

// Mocks
jest.mock("../../../src/api/categories.api", () => ({
  getAllCategories: jest.fn(() => Promise.resolve({ data: [] })),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
    NavLink: ({ children, to }) => <a href={to}>{children}</a>,
    Link: ({ to, children }) => <a href={to}>{children}</a>,
  };
});

jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">SearchIcon</div>,
  Plus: () => <div data-testid="plus-icon">PlusIcon</div>,
  LogOut: () => <div data-testid="logout-icon">LogOutIcon</div>,
}));

describe("Navigation Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    localStorage.clear();
  });

  test("debe navegar a /categoriasBusqueda/test al buscar", async () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    // Abrir modal
    const searchIcon = screen.getByTestId("search-icon");
    fireEvent.click(searchIcon);

    // Escribir búsqueda
    const input = await screen.findByPlaceholderText(/Buscar producto por/);
    fireEvent.change(input, { target: { value: "test" } });

    // Enviar formulario
    const submitButton = screen.getByRole("button", { name: /SearchIcon/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/categoriasBusqueda/test");
    });
  });

  test("debe cerrar el modal al hacer clic en cancelar", async () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    // Abrir modal
    const searchIcon = screen.getByTestId("search-icon");
    fireEvent.click(searchIcon);

    // Cerrar modal
    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Buscar producto por/)).not.toBeInTheDocument();
    });
  });

  test("debe navegar a /categoriasForm al hacer clic en +", () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    const plusIcon = screen.getByTestId("plus-icon");
    fireEvent.click(plusIcon.closest("button"));

    expect(mockNavigate).toHaveBeenCalledWith("/categoriasForm");
  });

  test("debe eliminar authToken y navegar a /login al hacer logout", () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    const logoutIcon = screen.getByTestId("logout-icon");
    fireEvent.click(logoutIcon.closest("button"));

    expect(localStorage.getItem("authToken")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});