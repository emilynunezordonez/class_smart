import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import PiePago from "../../../src/pages/dashboard/PiePago";
import "@testing-library/jest-dom";

// Mock VictoryPie para simplificar el test
jest.mock("victory", () => {
  const actual = jest.requireActual("victory");
  return {
    ...actual,
    VictoryPie: ({ data }) => (
      <div data-testid="victory-pie">
        {data.map((d, idx) => (
          <div key={idx} data-testid="slice">
            {d.x}: {d.y}
          </div>
        ))}
      </div>
    ),
  };
});

// Mock de la API
jest.mock("../../../src/api/dashboard.api", () => ({
  metodosPMasUtilizados: jest.fn(() =>
    Promise.resolve({
      data: [
        { metodo_pago: "transferencia", frecuencia: 12 },
        { metodo_pago: "tarjeta", frecuencia: 8 },
        { metodo_pago: "efecty", frecuencia: 5 },
      ],
    })
  ),
}));

describe("PiePago", () => {
  test("muestra los métodos de pago más utilizados", async () => {
    render(<PiePago />);

    await waitFor(() => {
      const pie = screen.getByTestId("victory-pie");
      expect(pie).toBeInTheDocument();

      const slices = screen.getAllByTestId("slice");
      expect(slices).toHaveLength(3);
      expect(slices[0]).toHaveTextContent("Transferencia: 12");
      expect(slices[1]).toHaveTextContent("Tarjeta: 8");
      expect(slices[2]).toHaveTextContent("Efecty: 5");
    });
  });
});
