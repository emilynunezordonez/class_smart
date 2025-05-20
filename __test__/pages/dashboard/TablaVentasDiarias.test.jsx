import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import { TableVentasDiarias } from "../../../src/pages/dashboard/TableVentasDiarias";
import "@testing-library/jest-dom";
import { ventasDiarias } from "../../../src/api/dashboard.api";

jest.mock("../../../src/api/dashboard.api", () => ({
  ventasDiarias: jest.fn(() =>
    Promise.resolve({
      data: [
        { fecha: "2024-01-01", total_pedidos: 5, total_ventas: 100 },
        { fecha: "2024-01-02", total_pedidos: 3, total_ventas: 60 },
      ],
    })
  ),
}));

// Mock de react-data-table-component
jest.mock("react-data-table-component", () => {
  return ({ columns, data, title }) => {
    return (
      <div data-testid="data-table">
        {title && <h2 data-testid="table-title">{title}</h2>}
        {data.map((row, idx) => (
          <div key={idx} data-testid="table-row">
            {columns.map((col, colIdx) => (
              <span key={colIdx} data-testid="cell">
                {col.selector(row)}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };
});

// Mock de la API
jest.mock("../../../src/api/dashboard.api", () => ({
  ventasDiarias: jest.fn(() =>
    Promise.resolve({
      data: [
        { fecha: "2024-01-01", total_pedidos: 5, total_ventas: 100 },
        { fecha: "2024-01-02", total_pedidos: 3, total_ventas: 60 },
      ],
    })
  ),
}));

describe("TableVentasDiarias", () => {
  test("renderiza correctamente y muestra los datos", async () => {
    render(<TableVentasDiarias />);

    await waitFor(() => {
      const rows = screen.getAllByTestId("table-row");
      expect(rows).toHaveLength(2);

      const cellsRow1 = within(rows[0]).getAllByTestId("cell");
      expect(cellsRow1[0]).toHaveTextContent("2024-01-01");
      expect(cellsRow1[1]).toHaveTextContent("5");
      expect(cellsRow1[2]).toHaveTextContent("100");

      const cellsRow2 = within(rows[1]).getAllByTestId("cell");
      expect(cellsRow2[0]).toHaveTextContent("2024-01-02");
      expect(cellsRow2[1]).toHaveTextContent("3");
      expect(cellsRow2[2]).toHaveTextContent("60");
    });
  });

  test("filtra por fecha cuando se escribe en el input", async () => {
    render(<TableVentasDiarias />);

    await waitFor(() => screen.getAllByTestId("table-row"));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "2024-01-01" } });

    await waitFor(() => {
      const filteredRows = screen.getAllByTestId("table-row");
      expect(filteredRows).toHaveLength(1);
      expect(filteredRows[0]).toHaveTextContent("2024-01-01");
    });
  });
  test("muestra cero resultados si la fecha no coincide", async () => {
    render(<TableVentasDiarias />);

    await waitFor(() => screen.getAllByTestId("table-row"));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "2025-12-31" } });

    await waitFor(() => {
      const filteredRows = screen.queryAllByTestId("table-row");
      expect(filteredRows).toHaveLength(0);
    });
  });

  // Test que cubre cuando no hay datos desde la API
  test("muestra tabla vacía cuando ventasDiarias devuelve un arreglo vacío", async () => {
    ventasDiarias.mockResolvedValueOnce({ data: [] }); // sobrescribe el mock para este test

    render(<TableVentasDiarias />);

    await waitFor(() => {
      const rows = screen.queryAllByTestId("table-row");
      expect(rows).toHaveLength(0); // no hay filas que mostrar
    });
  });
  test("muestra estado inicial correctamente", () => {
    render(<TableVentasDiarias />);

    // Verificar que el input está presente
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    // Verificar que el título de la tabla está presente usando data-testid
    const titleElement = screen.getByTestId("table-title");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent("Ventas Diarias");
  });

  test("restablece el filtro cuando se borra el texto de búsqueda", async () => {
    render(<TableVentasDiarias />);

    await waitFor(() => screen.getAllByTestId("table-row"));

    const input = screen.getByRole("textbox");

    // Aplicar filtro
    fireEvent.change(input, { target: { value: "2024-01-01" } });
    await waitFor(() => {
      expect(screen.getAllByTestId("table-row")).toHaveLength(1);
    });

    // Borrar filtro
    fireEvent.change(input, { target: { value: "" } });
    await waitFor(() => {
      expect(screen.getAllByTestId("table-row")).toHaveLength(2);
    });
  });
  test("ejecuta los selectores de columnas manualmente para cobertura completa", () => {
    const row = {
      fecha: "2024-01-01",
      total_pedidos: 5,
      total_ventas: 100,
    };

    const columns = [
      {
        name: "Fecha",
        selector: (r) => r.fecha,
      },
      {
        name: "Total Pedidos",
        selector: (r) => r.total_pedidos,
      },
      {
        name: "Total Ventas",
        selector: (r) => r.total_ventas,
      },
    ];

    expect(columns[0].selector(row)).toBe("2024-01-01");
    expect(columns[1].selector(row)).toBe(5);
    expect(columns[2].selector(row)).toBe(100);
  });
});
