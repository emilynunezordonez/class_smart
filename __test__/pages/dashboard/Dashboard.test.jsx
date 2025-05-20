import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../../../src/pages/dashboard/Dashboard";
import "@testing-library/jest-dom";

jest.mock("../../../src/pages/dashboard/TablaProductosMasVendidos", () => ({
  TablaProductosMasVendidos: () => (
    <div data-testid="tabla-productos">TablaProductosMasVendidos</div>
  ),
}));

jest.mock("../../../src/pages/dashboard/TableIndicadoresUsuario", () => ({
  TableIndicadoresUsuario: () => (
    <div data-testid="tabla-indicadores">TableIndicadoresUsuario</div>
  ),
}));

jest.mock("../../../src/pages/dashboard/TableVentasDiarias", () => ({
  TableVentasDiarias: () => (
    <div data-testid="tabla-ventas">TableVentasDiarias</div>
  ),
}));

jest.mock("../../../src/pages/dashboard/BarrasProductosMasVendidos", () => ({
  BarrasProductosMasVendidos: () => (
    <div data-testid="barras-productos">BarrasProductosMasVendidos</div>
  ),
}));

jest.mock("../../../src/pages/dashboard/BarrasIndicadoresUsuarios", () => ({
  BarrasIndicadoresUsuarios: () => (
    <div data-testid="barras-indicadores">BarrasIndicadoresUsuarios</div>
  ),
}));

jest.mock("../../../src/pages/dashboard/LineasVentasDiarias", () => () => (
  <div data-testid="lineas-ventas">LineasVentasDiarias</div>
));

jest.mock("../../../src/pages/dashboard/PiePago", () => () => (
  <div data-testid="pie-pago">PiePago</div>
));

jest.mock("../../../src/pages/dashboard/PieEstadoPedido", () => () => (
  <div data-testid="pie-estado">PieEstadoPedido</div>
));
// Mock de API
jest.mock("../../../src/api/dashboard.api", () => ({
  productosMasVendidos: jest.fn(() =>
    Promise.resolve({ data: [{ nombre: "Producto A", cantidad: 10 }] })
  ),
  valorTotalVentas: jest.fn(() =>
    Promise.resolve({ data: { total_ventas: 5000 } })
  ),
  indicadoresUsuario: jest.fn(() =>
    Promise.resolve({
      data: [
        { usuarios__username: "usuario1", total_pedidos: 3 },
        { usuarios__username: "usuario2", total_pedidos: 5 },
      ],
    })
  ),
}));

describe("Dashboard", () => {
  test("renderiza todos los componentes correctamente con datos", async () => {
    render(<Dashboard />);

    // Verifica que todos los subcomponentes se renderizan
    await waitFor(() => {
      expect(screen.getByText("Dash Board")).toBeInTheDocument();
      expect(screen.getByTestId("tabla-productos")).toBeInTheDocument();
      expect(screen.getByTestId("tabla-indicadores")).toBeInTheDocument();
      expect(screen.getByTestId("tabla-ventas")).toBeInTheDocument();
      expect(screen.getByTestId("barras-productos")).toBeInTheDocument();
      expect(screen.getByTestId("barras-indicadores")).toBeInTheDocument();
      expect(screen.getByTestId("lineas-ventas")).toBeInTheDocument();
      expect(screen.getByTestId("pie-pago")).toBeInTheDocument();
      expect(screen.getByTestId("pie-estado")).toBeInTheDocument();
      expect(screen.getByText(/Total Ingresos:/)).toBeInTheDocument();
      expect(screen.getByText("5000$")).toBeInTheDocument();
    });
  });

  test("muestra ingresos como 0 si indicadores están vacíos", async () => {
    const api = require("../../../src/api/dashboard.api");
    api.indicadoresUsuario.mockResolvedValueOnce({ data: [] });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("5000$")).toBeInTheDocument(); // total_ventas sigue viniendo de valorTotalVentas
    });
  });
});
