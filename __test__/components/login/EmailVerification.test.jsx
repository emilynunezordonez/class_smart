import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { EmailVerification } from "../../../src/components/login/EmailVerification.jsx";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock de useParams y useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

// Mock del servicio de autenticación
jest.mock("../../../src/services/authService", () => ({
  authService: {
    verifyEmail: jest.fn(),
  },
}));

import { useParams } from "react-router-dom";
import { authService } from "../../../src/services/authService";

describe("EmailVerification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("muestra mensaje de éxito si la verificación es exitosa", async () => {
    useParams.mockReturnValue({ token: "valid-token" });
    authService.verifyEmail.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <EmailVerification />
      </MemoryRouter>
    );

    expect(screen.getByText("Verificando...")).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText("Email verificado exitosamente")
      ).toBeInTheDocument()
    );
  });

  test("muestra mensaje de error si la verificación falla", async () => {
    useParams.mockReturnValue({ token: "invalid-token" });
    authService.verifyEmail.mockRejectedValueOnce(new Error("Token inválido"));

    render(
      <MemoryRouter>
        <EmailVerification />
      </MemoryRouter>
    );

    expect(screen.getByText("Verificando...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("Error en la verificación")).toBeInTheDocument()
    );
  });
});
