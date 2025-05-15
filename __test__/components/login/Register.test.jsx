import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Register } from "../../../src/components/login/Register";
import { authService } from "../../../src/services/authService";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

import "@testing-library/jest-dom";

// Mock externo
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("../../../src/services/authService", () => ({
  authService: {
    register: jest.fn(),
  },
}));

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

jest.mock("react-google-recaptcha");

const setCaptchaValue = (value) => {
  ReCAPTCHA.setMockCaptchaValue(value);
};

// Componente con Router
const RegisterWithRouter = () => (
  <BrowserRouter>
    <Register />
  </BrowserRouter>
);

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setCaptchaValue("test-captcha-value"); // valor por defecto
  });

  test("renders correctly", () => {
    render(<RegisterWithRouter />);

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Registro de Usuario")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password")
    ).toBeInTheDocument();
    expect(screen.getByText("Registrarse")).toBeInTheDocument();
    expect(screen.getByTestId("recaptcha")).toBeInTheDocument();
  });

  test("updates form data when inputs change", () => {
    render(<RegisterWithRouter />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "password123" },
    });

    expect(screen.getByPlaceholderText("Username").value).toBe("testuser");
    expect(screen.getByPlaceholderText("Email").value).toBe("test@example.com");
    expect(screen.getByPlaceholderText("Password").value).toBe("password123");
    expect(screen.getByPlaceholderText("Confirm your password").value).toBe(
      "password123"
    );
  });

  test("shows error when passwords do not match", () => {
    render(<RegisterWithRouter />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "differentpassword" },
    });

    fireEvent.click(screen.getByText("Registrarse"));

    expect(toast.error).toHaveBeenCalledWith(
      "Las contraseñas no coinciden",
      expect.any(Object)
    );
    expect(authService.register).not.toHaveBeenCalled();
  });

  test("shows error when captcha is not validated", () => {
    setCaptchaValue(""); // Captcha vacío

    render(<RegisterWithRouter />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Registrarse"));

    expect(toast.error).toHaveBeenCalledWith(
      "Por favor, verifica que no eres un robot.",
      expect.any(Object)
    );
    expect(authService.register).not.toHaveBeenCalled();
  });

  test("submits form with valid data and shows success message", async () => {
    authService.register.mockResolvedValue({ success: true });

    setCaptchaValue("valid-captcha-response");

    render(<RegisterWithRouter />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Registrarse"));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith(
        "testuser",
        "test@example.com",
        "password123",
        "valid-captcha-response"
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Registro exitoso",
        expect.any(Object)
      );
    });
  });

  test("shows error message when registration fails", async () => {
    const errorMessage = "Error en el registro";
    authService.register.mockRejectedValue(errorMessage);

    setCaptchaValue("valid-captcha-response");

    render(<RegisterWithRouter />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Registrarse"));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        errorMessage,
        expect.any(Object)
      );
    });
  });
});
