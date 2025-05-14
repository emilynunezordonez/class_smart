import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CategoriasList } from "../../../src/components/categoria/CategoriasList";
import { getAllCategories } from "../../../src/api/categories.api";
import "@testing-library/jest-dom";

// Mock de la API y componentes hijos
jest.mock("../../../src/api/categories.api", () => ({
  getAllCategories: jest.fn(),
}));

jest.mock("../../../src/components/categoria/CategoriaCard", () => ({
  CategoriaCard: ({ categoria }) => (
    <div data-testid="categoria-card">{categoria.nombre_categoria}</div>
  ),
}));

describe("CategoriasList", () => {
  const mockCategorias = [
    { id: 1, nombre_categoria: "Electrónicos" },
    { id: 2, nombre_categoria: "Ropa" },
    { id: 3, nombre_categoria: "Hogar" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe renderizar las categorías correctamente", async () => {
    getAllCategories.mockResolvedValue({ data: mockCategorias });
    
    render(<CategoriasList />);
    
    // Verificar que se muestran las categorías
    const cards = await screen.findAllByTestId("categoria-card");
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveTextContent("Electrónicos");
    expect(cards[1]).toHaveTextContent("Ropa");
    expect(cards[2]).toHaveTextContent("Hogar");
  });

  test("debe manejar errores en la carga de categorías", async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getAllCategories.mockRejectedValue(new Error("Error de red"));
    
    render(<CategoriasList />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching pedidos:",
        expect.any(Error)
      );
    });
    
    consoleErrorSpy.mockRestore();
  });

  test("debe tener la estructura de grid correcta", async () => {
    getAllCategories.mockResolvedValue({ data: mockCategorias });
    
    const { container } = render(<CategoriasList />);
    
    await waitFor(() => {
      const grid = container.firstChild;
      expect(grid).toHaveClass("grid");
      expect(grid).toHaveClass("grid-cols-3");
      expect(grid).toHaveClass("gap-3");
    });
  });

  test("debe renderizar correctamente con lista vacía", async () => {
    getAllCategories.mockResolvedValue({ data: [] });
    
    render(<CategoriasList />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("categoria-card")).not.toBeInTheDocument();
    });
  });
});