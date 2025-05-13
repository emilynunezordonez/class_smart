import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { ProductCard } from "../../../src/components/products/ProductCard.jsx";
import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

// Mock de useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

Object.assign(global, { TextDecoder, TextEncoder });

describe("ProductCard", () => {
  const mockProduct = {
    id: 1,
    nombre: "Producto Test",
    precio: 10,
    cantidad_producto: 2,
    descripcion: "Descripción test",
    foto_producto: "https://via.placeholder.com/150",
  };

  test("se renderiza sin errores", () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );
  });

  test("muestra la imagen cuando hay foto_producto", () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      mockProduct.foto_producto
    );
    expect(screen.getByRole("img")).toHaveAttribute("alt", mockProduct.nombre);
  });

  test("no muestra imagen cuando no hay foto_producto", () => {
    const productWithoutImage = { ...mockProduct, foto_producto: null };

    render(
      <MemoryRouter>
        <ProductCard product={productWithoutImage} />
      </MemoryRouter>
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("muestra todas las propiedades del producto", () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    expect(screen.getByText(mockProduct.nombre)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.precio}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Disponibles: ${mockProduct.cantidad_producto}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Descripción: ${mockProduct.descripcion}`)
    ).toBeInTheDocument();
  });
});
