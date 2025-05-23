import React from "react";
import { render, screen } from "@testing-library/react";
import { BarrasIndicadoresUsuarios } from "../../../src/pages/dashboard/BarrasIndicadoresUsuarios";
import "@testing-library/jest-dom";

describe("BarrasIndicadoresUsuarios", () => {
  const mockData = [
    { nombre: "Usuario A", total_pedidos: 5 },
    { nombre: "Usuario B", total_pedidos: 8 },
    { nombre: "Usuario C", total_pedidos: 12 },
  ];

  test("renderiza correctamente los nombres en el eje X", () => {
    render(<BarrasIndicadoresUsuarios selectedRowsIndicadores={mockData} />);

    // Verificamos que se muestran los nombres como etiquetas
    mockData.forEach(({ nombre }) => {
      expect(screen.getByText(nombre)).toBeInTheDocument();
    });
  });

  test("renderiza el gráfico SVG", () => {
    render(<BarrasIndicadoresUsuarios selectedRowsIndicadores={mockData} />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  test("no falla si no hay datos", () => {
    render(<BarrasIndicadoresUsuarios selectedRowsIndicadores={[]} />);
    expect(document.querySelector("svg")).toBeInTheDocument();
  });
});
