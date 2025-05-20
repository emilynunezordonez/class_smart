import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TablaProductosMasVendidos } from "../../../src/pages/dashboard/TablaProductosMasVendidos";
import { tablaProductosMasVendidos } from "../../../src/api/dashboard.api";
import userEvent from "@testing-library/user-event"



jest.mock("../../../src/api/dashboard.api", () => ({
  tablaProductosMasVendidos: jest.fn(),
}));

describe("TablaProductosMasVendidos", () => {
  const mockSetSelectedRows = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("muestra estado de carga durante la petición a la API", () => {
    tablaProductosMasVendidos.mockImplementation(() => new Promise(() => { }));

    render(<TablaProductosMasVendidos setSelectedRows={mockSetSelectedRows} />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toHaveTextContent(
      "Cargando datos..."
    );
  });

  test("muestra mensaje cuando no hay datos", async () => {
    tablaProductosMasVendidos.mockResolvedValue({ data: [] });

    render(<TablaProductosMasVendidos setSelectedRows={mockSetSelectedRows} />);

    await waitFor(() => {
      expect(screen.getByTestId("no-data")).toBeInTheDocument();
      expect(screen.getByTestId("no-data")).toHaveTextContent(
        "No hay registros para mostrar"
      );
    });
  });

  test("maneja error en la carga de datos", async () => {
    tablaProductosMasVendidos.mockRejectedValue(new Error("Error de API"));

    render(<TablaProductosMasVendidos setSelectedRows={mockSetSelectedRows} />);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error: Error de API"
      );
    });
  });

  test("renderiza correctamente con datos", async () => {
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

  test("llama a setSelectedRows con los datos formateados al seleccionar filas", async () => {
    const mockData = [
      { nombre: "Producto 1", precio: 100, estado_producto: true, cantidad_producto: 10, total_vendidos: 5, ingresos: 500 },
      { nombre: "Producto 2", precio: 200, estado_producto: false, cantidad_producto: 5, total_vendidos: 2, ingresos: 100 },
    ];
    tablaProductosMasVendidos.mockResolvedValue({ data: mockData });

    render(<TablaProductosMasVendidos setSelectedRows={mockSetSelectedRows} />);
    await waitFor(() => expect(screen.getByText("Producto 1")).toBeInTheDocument());

    // Simula selección de filas usando el checkbox
    const checkboxes = screen.getAllByRole("checkbox");
    // El primer checkbox es el de "select all", el segundo y siguientes son los de las filas
    userEvent.click(checkboxes[1]); // Selecciona la primera fila

    // Espera a que setSelectedRows sea llamado
    await waitFor(() => {
      expect(mockSetSelectedRows).toHaveBeenCalledWith([
        { nombre: "Producto 1", total_vendidos: 5 },
      ]);
    });
  });

  it("filtra los registros al escribir en el input de búsqueda", async () => {
    const mockData = [
      { nombre: "Producto 1", precio: 100, estado_producto: true, cantidad_producto: 10, total_vendidos: 5, ingresos: 500 },
      { nombre: "Otro Producto", precio: 200, estado_producto: false, cantidad_producto: 5, total_vendidos: 2, ingresos: 100 },
    ];
    tablaProductosMasVendidos.mockResolvedValue({ data: mockData });

    render(<TablaProductosMasVendidos setSelectedRows={mockSetSelectedRows} />);
    await waitFor(() => expect(screen.getByText("Producto 1")).toBeInTheDocument());

    const input = screen.getByTestId("search-input");
    userEvent.type(input, "otro");

    await waitFor(() => {
      expect(screen.getByText("Otro Producto")).toBeInTheDocument();
      expect(screen.queryByText("Producto 1")).not.toBeInTheDocument();
    });
  });
});
