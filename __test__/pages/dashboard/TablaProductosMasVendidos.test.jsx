import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TablaProductosMasVendidos } from "../../../src/pages/dashboard/TablaProductosMasVendidos";
import { tablaProductosMasVendidos } from "../../../src/api/dashboard.api";

jest.mock("../../../src/api/dashboard.api", () => ({
  tablaProductosMasVendidos: jest.fn(),
}));

describe("TablaProductosMasVendidos", () => {
  const mockSetSelectedRows = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("muestra estado de carga durante la petición a la API", () => {
    tablaProductosMasVendidos.mockImplementation(() => new Promise(() => {}));

    render(<TablaProductosMasVendidos setSelectedRows={mockSetSelectedRows} />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toHaveTextContent(
      "Cargando datos..."
    );
  });

  it("muestra mensaje cuando no hay datos", async () => {
    tablaProductosMasVendidos.mockResolvedValue({ data: [] });

    render(<TablaProductosMasVendidos setSelectedRows={mockSetSelectedRows} />);

    await waitFor(() => {
      expect(screen.getByTestId("no-data")).toBeInTheDocument();
      expect(screen.getByTestId("no-data")).toHaveTextContent(
        "No hay registros para mostrar"
      );
    });
  });

  it("maneja error en la carga de datos", async () => {
    tablaProductosMasVendidos.mockRejectedValue(new Error("Error de API"));

    render(<TablaProductosMasVendidos setSelectedRows={mockSetSelectedRows} />);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error: Error de API"
      );
    });
  });

  it("renderiza correctamente con datos", async () => {
    const mockData = [
      {
        nombre: "Producto 1",
        precio: 100,
        estado_producto: true,
        cantidad_producto: 10,
        total_vendidos: 5,
        ingresos: 500,
      },
    ];

    tablaProductosMasVendidos.mockResolvedValue({ data: mockData });

    render(<TablaProductosMasVendidos setSelectedRows={mockSetSelectedRows} />);

    await waitFor(() => {
      expect(screen.getByText("Producto 1")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("Activo")).toBeInTheDocument();
    });
  });
});
