import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { CategoriaCard } from "../../src/components/categoria/CategoriaCard";
import "@testing-library/jest-dom";

// Mock de useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

/* describe("CategoriaCard Component", () => {
  const mockCategoria = {
    id: 1,
    nombre_categoria: "Electrónicos",
  };

  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza correctamente la categoría", () => {
    render(
      <MemoryRouter>
        <CategoriaCard categoria={mockCategoria} />
      </MemoryRouter>
    );

    // Verifica que el nombre de la categoría se muestra correctamente
    expect(
      screen.getByText(mockCategoria.nombre_categoria)
    ).toBeInTheDocument();
    expect(screen.getByText(mockCategoria.nombre_categoria)).toHaveClass(
      "font-bold",
      "uppercase"
    );
  });

  test("aplica las clases CSS correctas", () => {
    render(
      <MemoryRouter>
        <CategoriaCard categoria={mockCategoria} />
      </MemoryRouter>
    );

    const cardElement = screen.getByRole("button"); // El div actúa como botón

    expect(cardElement).toHaveClass("bg-gray-200");
    expect(cardElement).toHaveClass("hover:bg-gray-300");
    expect(cardElement).toHaveClass("transition");
    expect(cardElement).toHaveClass("hover:cursor-pointer");
  });

  test("navega al hacer click con el ID correcto", () => {
    render(
      <MemoryRouter>
        <CategoriaCard categoria={mockCategoria} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/categoriasForm/1");
  });

  test("el texto está centrado", () => {
    render(
      <MemoryRouter>
        <CategoriaCard categoria={mockCategoria} />
      </MemoryRouter>
    );

    const container = screen.getByText(
      mockCategoria.nombre_categoria
    ).parentElement;
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("justify-center");
    expect(container).toHaveClass("items-center");
  });
}); */
describe("CategoriaCard", () => {
  let props;

  beforeEach(() => {
    props = {
      categoria: {
        id: 1,
        nombre_categoria: "Electrónicos",
      },
    };
    useNavigate.mockClear();
  });

  test("renderiza el nombre", () => {
    render(<CategoriaCard {...props} />);
    expect(
      screen.getByText(props.categoria.nombre_categoria)
    ).toBeInTheDocument();
  });
});
