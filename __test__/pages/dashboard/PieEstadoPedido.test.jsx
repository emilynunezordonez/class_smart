import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import PieEstadoPedido from "../../../src/pages/dashboard/PieEstadoPedido";
import "@testing-library/jest-dom";

// Mock de VictoryPie para simplificar
jest.mock("victory", () => {
  const actual = jest.requireActual("victory");
  return {
    ...actual,
    VictoryPie: (props) => (
      <div data-testid="victory-pie">
        {props.data.map((item, index) => (
          <div key={index} data-testid="slice">
            {item.x}: {item.y}
          </div>
        ))}
      </div>
    ),
  };
});

// Mock base de la API
jest.mock("../../../src/api/dashboard.api", () => ({
  estadosPedidos: jest.fn(),
}));

describe("PieEstadoPedido", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza correctamente los datos cuando hay dos estados", async () => {
    const { estadosPedidos } = require("../../../src/api/dashboard.api");
    estadosPedidos.mockResolvedValueOnce({
      data: [
        { estado: "en proceso", total_pedidos: 5 },
        { estado: "entregado", total_pedidos: 10 },
      ],
    });

    render(<PieEstadoPedido />);

    await waitFor(() => {
      const slices = screen.getAllByTestId("slice");
      expect(slices).toHaveLength(2);
      expect(slices[0]).toHaveTextContent("Entregado: 10");
      expect(slices[1]).toHaveTextContent("En proceso: 5");
    });
  });

  test("renderiza correctamente cuando hay un solo estado con usuarios__username", async () => {
    const { estadosPedidos } = require("../../../src/api/dashboard.api");
    estadosPedidos.mockResolvedValueOnce({
      data: [{ total_pedidos: 3, usuarios__username: true }],
    });

    render(<PieEstadoPedido />);
    await waitFor(() => {
      const slices = screen.getAllByTestId("slice");
      expect(slices).toHaveLength(1);
      expect(slices[0]).toHaveTextContent("Entregado: 3");
    });
  });

  test("renderiza correctamente cuando hay un solo estado sin usuarios__username", async () => {
    const { estadosPedidos } = require("../../../src/api/dashboard.api");
    estadosPedidos.mockResolvedValueOnce({
      data: [{ total_pedidos: 4, usuarios__username: null }],
    });

    render(<PieEstadoPedido />);
    await waitFor(() => {
      const slices = screen.getAllByTestId("slice");
      expect(slices).toHaveLength(1);
      expect(slices[0]).toHaveTextContent("En Proceso: 4");
    });
  });

  test("no renderiza ningún dato cuando data está vacía", async () => {
    const { estadosPedidos } = require("../../../src/api/dashboard.api");
    estadosPedidos.mockResolvedValueOnce({ data: [] });

    render(<PieEstadoPedido />);
    await waitFor(() => {
      expect(screen.queryByTestId("slice")).not.toBeInTheDocument();
    });
  });
});
