import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserList } from "../../../src/components/users/UserList"; // Ajusta la ruta
import { getAllUsers, searchUsers } from "../../../src/api/users.api";
import "@testing-library/jest-dom";

// Mock de las funciones de la API
jest.mock("../../../src/api/users.api", () => ({
  getAllUsers: jest.fn(),
  searchUsers: jest.fn(),
}));

describe("UserList", () => {
  const mockUsers = [
    { id: 1, username: "usuario1", email: "user1@example.com" },
    { id: 2, username: "usuario2", email: "user2@example.com" },
  ];

  const mockFiltered = {
    data: {
      users: [
        { id: 3, username: "filtrado", email: "filtro@example.com" }
      ],
    }
  };

  test("renderiza usuarios correctamente cuando no hay búsqueda", async () => {
    getAllUsers.mockResolvedValueOnce({ data: mockUsers });

    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("usuario1")).toBeInTheDocument();
      expect(screen.getByText("usuario2")).toBeInTheDocument();
    });
  });

  test("renderiza usuarios filtrados correctamente", async () => {
    searchUsers.mockResolvedValueOnce(mockFiltered);

    render(
      <MemoryRouter>
        <UserList searchCriteria="username" searchValue="filtrado" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("filtrado")).toBeInTheDocument();
      expect(screen.getByText("filtro@example.com")).toBeInTheDocument();
    });
  });

  test("muestra mensaje de error en consola si falla la carga", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    getAllUsers.mockRejectedValueOnce(new Error("Error de red"));

    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error al cargar los datos");
    });

    consoleSpy.mockRestore();
  });
});
