import React from "react";
import { render, screen } from "@testing-library/react";
import { BarrasProductosMasVendidos } from "../../../src/pages/dashboard/BarrasProductosMasVendidos";
import "@testing-library/jest-dom";

describe("BarrasProductosMasVendidos", () => {
  const mockData = [
    { nombre: "Producto A", total_vendidos: 30 },
    { nombre: "Producto B", total_vendidos: 45 },
    { nombre: "Producto C", total_vendidos: 20 },
  ];

  test("renderiza correctamente los nombres en el eje X", () => {
    render(<BarrasProductosMasVendidos selectedRows={mockData} />);

    mockData.forEach(({ nombre }) => {
      expect(screen.getByText(nombre)).toBeInTheDocument();
    });
  });

  test("renderiza el gráfico SVG", () => {
    render(<BarrasProductosMasVendidos selectedRows={mockData} />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  test("no falla si no se le pasan datos", () => {
    render(<BarrasProductosMasVendidos selectedRows={[]} />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
