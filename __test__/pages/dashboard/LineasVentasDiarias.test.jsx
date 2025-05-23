import React from "react";
import { ventasDiarias } from "../../../src/api/dashboard.api";
import LineasVentasDiarias from "../../../src/pages/dashboard/LineasVentasDiarias";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("../../../src/api/dashboard.api");

describe("LineasVentasDiarias", () => {
  test("renderiza y procesa datos correctamente", async () => {
    ventasDiarias.mockResolvedValueOnce({
      data: [
        { fecha: "2024-05-01", total_ventas: 100 },
        { fecha: "2024-05-02", total_ventas: 200 },
      ],
    });

    render(<LineasVentasDiarias />);

    // Espera a que los datos estén cargados y que VictoryLine reciba los datos
    await waitFor(() => {
      expect(screen.getByText("1/5")).toBeInTheDocument();
    });

    const lines = document.querySelectorAll("path");
    expect(lines.length).toBeGreaterThan(0);
  });
});
