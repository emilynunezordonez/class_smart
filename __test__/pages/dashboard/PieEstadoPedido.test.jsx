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

// Mock de la API
jest.mock("../../../src/api/dashboard.api", () => ({
  estadosPedidos: jest.fn(() =>
    Promise.resolve({
      data: [
        { estado: "en proceso", total_pedidos: 5 },
        { estado: "entregado", total_pedidos: 10 },
      ],
    })
  ),
}));

describe("PieEstadoPedido", () => {
  test("renderiza correctamente los datos en el gráfico", async () => {
    render(<PieEstadoPedido />);

    // Espera a que los datos se procesen y se rendericen
    await waitFor(() => {
      expect(screen.getByTestId("victory-pie")).toBeInTheDocument();
      const slices = screen.getAllByTestId("slice");
      expect(slices).toHaveLength(2);
      expect(slices[0]).toHaveTextContent("Entregado: 10");
      expect(slices[1]).toHaveTextContent("En proceso: 5");
    });
  });
});
