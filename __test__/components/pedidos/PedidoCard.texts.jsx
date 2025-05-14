import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { PedidoCard } from "../../../src/components/pedido/PedidoCard";
import { getUser } from "../../../src/api/users.api";
import "@testing-library/jest-dom";

// Mock de useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock de la API getUser
jest.mock("../../../src/api/users.api", () => ({
  getUser: jest.fn(),
}));

describe("PedidoCard", () => {
  const mockPedido = {
    id: 101,
    usuarios: 5,
    metodo_pago: "Tarjeta",
    fecha: "2025-05-14",
    hora: "12:00",
    direccion: "Calle Falsa 123",
    estado_pedido: true,
  };

  const mockUsuario = {
    data: {
      id: 5,
      username: "juanperez",
    },
  };

  beforeEach(() => {
    getUser.mockClear();
    useNavigate.mockClear();
  });

  test("renderiza información del pedido", async () => {
    getUser.mockResolvedValueOnce(mockUsuario);

    render(
      <MemoryRouter>
        <PedidoCard pedido={mockPedido} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Pedido #101/)).toBeInTheDocument();
    expect(screen.getByText(/Método de pago:/)).toBeInTheDocument();
    expect(screen.getByText("Tarjeta")).toBeInTheDocument();
    expect(screen.getByText(/Fecha:/)).toBeInTheDocument();
    expect(screen.getByText("2025-05-14")).toBeInTheDocument();
    expect(screen.getByText(/Hora:/)).toBeInTheDocument();
    expect(screen.getByText("12:00")).toBeInTheDocument();
    expect(screen.getByText(/Direccion:/)).toBeInTheDocument();
    expect(screen.getByText("Calle Falsa 123")).toBeInTheDocument();
    expect(screen.getByText("ENTREGADO")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/Cliente:/)).toHaveTextContent("juanperez")
    );
  });

  test("navega al hacer clic en la tarjeta", async () => {
    getUser.mockResolvedValueOnce(mockUsuario);
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <PedidoCard pedido={mockPedido} />
      </MemoryRouter>
    );

    const card = screen.getByText(/Pedido #101/).closest("div");
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/pedidosProductos/101/5");
  });
});