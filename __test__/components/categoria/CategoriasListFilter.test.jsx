import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom"; // Añadimos useNavigate al import
import { CategoriasListFilter } from "../../../src/components/categoria/CategoriasListFilter";
import { getAllCategories } from "../../../src/api/categories.api";
import "@testing-library/jest-dom";

// Mock de la API
jest.mock("../../../src/api/categories.api", () => ({
  getAllCategories: jest.fn(),
}));

// Mock de react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock del componente CategoriaCard
jest.mock("../../../src/components/categoria/CategoriaCard", () => ({
  CategoriaCard: ({ categoria }) => (
    <div data-testid="categoria-card">{categoria.nombre_categoria}</div>
  ),
}));

describe("CategoriasListFilter", () => {
  const mockCategorias = [
    { id: 1, nombre_categoria: "Electrónicos" },
    { id: 2, nombre_categoria: "Ropa" },
    { id: 3, nombre_categoria: "Hogar" },
    { id: 4, nombre_categoria: "Electrónicos" },
  ];

  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate); // Usamos useNavigate del mock
  });

  test("debe filtrar correctamente las categorías por nombre", async () => {
    const nombreFiltro = "Electrónicos";
    getAllCategories.mockResolvedValue({ data: mockCategorias });
    
    render(
      <MemoryRouter>
        <CategoriasListFilter nombre={nombreFiltro} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const cards = screen.getAllByTestId("categoria-card");
      expect(cards).toHaveLength(2);
      cards.forEach(card => {
        expect(card).toHaveTextContent(nombreFiltro);
      });
    });
  });

  test("debe navegar al hacer clic en el botón Volver", async () => {
    getAllCategories.mockResolvedValue({ data: mockCategorias });
    
    render(
      <MemoryRouter>
        <CategoriasListFilter nombre="Electrónicos" />
      </MemoryRouter>
    );
    
    const volverButton = await screen.findByText("Volver");
    fireEvent.click(volverButton);
    
    expect(mockNavigate).toHaveBeenCalledWith("/categorias/");
  });

  test("debe manejar errores en la carga de categorías", async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const nombreFiltro = "Electrónicos";
    getAllCategories.mockRejectedValue(new Error("Error de red"));
    
    render(
      <MemoryRouter>
        <CategoriasListFilter nombre={nombreFiltro} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching pedidos:",
        expect.any(Error)
      );
    });
    
    consoleErrorSpy.mockRestore();
  });

  test("debe tener las clases CSS correctas en el botón Volver", async () => {
    getAllCategories.mockResolvedValue({ data: mockCategorias });
    
    render(
      <MemoryRouter>
        <CategoriasListFilter nombre="Electrónicos" />
      </MemoryRouter>
    );
    
    const volverButton = await screen.findByText("Volver");
    expect(volverButton).toHaveClass("bg-customBlue");
    expect(volverButton).toHaveClass("p-3");
    expect(volverButton).toHaveClass("w-48");
    expect(volverButton).toHaveClass("font-bold");
    expect(volverButton).toHaveClass("rounded-lg");
    expect(volverButton).toHaveClass("mt-7");
    expect(volverButton).toHaveClass("ml-2");
  });
});