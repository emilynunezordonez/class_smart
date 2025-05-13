import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { CategoriaCard } from "../../../src/components/categoria/CategoriaCard";
import "@testing-library/jest-dom";

// Mock de useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

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

  test("navega al hacer clic en la tarjeta de categoría", () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <CategoriaCard {...props} />
      </MemoryRouter>
    );

    const card = screen.getByText(props.categoria.nombre_categoria).closest("div");
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/categoriasForm/1");
  });

});
