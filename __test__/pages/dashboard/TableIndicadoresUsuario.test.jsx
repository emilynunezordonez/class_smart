import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TableIndicadoresUsuario } from "../../../src/pages/dashboard/TableIndicadoresUsuario";
import * as api from "../../../src/api/dashboard.api";

// Mock del API
jest.mock("../../../src/api/dashboard.api");

describe("TableIndicadoresUsuario", () => {
  const mockData = [
    {
      usuarios__username: "juan",
      total_productos_vendidos: 10,
      total_pedidos: 5,
      ingresos_por_usuario: 1000,
    },
    {
      usuarios__username: "ana",
      total_productos_vendidos: 20,
      total_pedidos: 15,
      ingresos_por_usuario: 2000,
    },
  ];

  test("renderiza y muestra datos", async () => {
    api.indicadoresUsuario.mockResolvedValueOnce({ data: mockData });

    render(<TableIndicadoresUsuario setSelectedRowsIndicadores={() => { }} />);

    // Esperar que los datos se carguen y aparezcan en la tabla
    await waitFor(() => {
      expect(screen.getByText("juan")).toBeInTheDocument();
      expect(screen.getByText("ana")).toBeInTheDocument();
    });
  });

  test("selección de filas llama setSelectedRowsIndicadores", async () => {
    api.indicadoresUsuario.mockResolvedValueOnce({ data: mockData });

    const setSelectedRowsIndicadores = jest.fn();

    render(
      <TableIndicadoresUsuario
        setSelectedRowsIndicadores={setSelectedRowsIndicadores}
      />
    );

    await waitFor(() => screen.getByText("juan"));

    // Simular seleccionar la primera fila
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // El primer checkbox es "select all", por eso el índice 1

    expect(setSelectedRowsIndicadores).toHaveBeenCalledTimes(1);
    expect(setSelectedRowsIndicadores).toHaveBeenCalledWith([
      {
        nombre: "juan",
        total_pedidos: 5,
      },
    ]);
  });

  test("filtra los registros al escribir en el input de búsqueda", async () => {
    api.indicadoresUsuario.mockResolvedValueOnce({ data: mockData });

    render(<TableIndicadoresUsuario setSelectedRowsIndicadores={() => { }} />);

    await waitFor(() => {
      expect(screen.getByText("juan")).toBeInTheDocument();
      expect(screen.getByText("ana")).toBeInTheDocument();
    });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "ana" } });

    // Solo debe aparecer "ana" después del filtrado
    await waitFor(() => {
      expect(screen.getByText("ana")).toBeInTheDocument();
      expect(screen.queryByText("juan")).not.toBeInTheDocument();
    });
  });
});
