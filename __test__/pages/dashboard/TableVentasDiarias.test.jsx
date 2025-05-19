import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { TableVentasDiarias } from "../../../src/pages/dashboard/TableVentasDiarias";
import "@testing-library/jest-dom";

// Mock de react-data-table-component
jest.mock("react-data-table-component", () => ({ columns, data }) => (
  <div data-testid="data-table">
    {data.map((row, idx) => (
      <div key={idx} data-testid="table-row">
        {row.fecha} - {row.total_pedidos} - {row.total_ventas}
      </div>
    ))}
  </div>
));

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
      expect(rows[0]).toHaveTextContent("2024-01-01 - 5 - 100");
      expect(rows[1]).toHaveTextContent("2024-01-02 - 3 - 60");
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
});
