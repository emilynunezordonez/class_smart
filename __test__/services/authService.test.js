import { authService } from "../../src/services/authService";
import { register_user, verfify_Email } from "../../src/api/users.api";

import {
  createPedido,
  llenarPedidosProductos,
  generarFacturaPedido,
} from "../../src/api/pedidos.api";

import { vaciarCarrito } from "../../src/api/products.api";

jest.mock("../../src/api/users.api", () => ({
  register_user: jest.fn(),
  verfify_Email: jest.fn(),
}));

jest.mock("../../src/api/pedidos.api", () => ({
  createPedido: jest.fn(),
  llenarPedidosProductos: jest.fn(),
  generarFacturaPedido: jest.fn(),
}));

jest.mock("../../src/api/products.api", () => ({
  vaciarCarrito: jest.fn(),
}));

describe("authService", () => {
  describe("register", () => {
    it("registra un usuario correctamente", async () => {
      const mockResponse = { data: { success: true } };
      register_user.mockResolvedValue(mockResponse);

      const result = await authService.register(
        "user",
        "email@test.com",
        "pass",
        "captcha-token"
      );
      expect(result).toEqual(mockResponse.data);
      expect(register_user).toHaveBeenCalledWith({
        captcha: "captcha-token",
        user: {
          username: "user",
          email: "email@test.com",
          password: "pass",
          is_staff: false,
          is_superuser: false,
        },
      });
    });

    it("lanza error si el registro falla", async () => {
      const error = { response: { data: "Register failed" } };
      register_user.mockRejectedValue(error);

      await expect(
        authService.register("user", "email@test.com", "pass", "captcha-token")
      ).rejects.toBe("Register failed");
    });
  });

  describe("verifyEmail", () => {
    it("verifica email correctamente", async () => {
      const mockResponse = { data: { verified: true } };
      verfify_Email.mockResolvedValue(mockResponse);

      const result = await authService.verifyEmail("token123");
      expect(result).toEqual(mockResponse.data);
      expect(verfify_Email).toHaveBeenCalledWith("token123");
    });

    it("lanza error si la verificación falla", async () => {
      const error = { response: { data: "Token inválido" } };
      verfify_Email.mockRejectedValue(error);

      await expect(authService.verifyEmail("invalid")).rejects.toBe(
        "Token inválido"
      );
    });
  });

  describe("HacerCompra", () => {
    beforeEach(() => {
      localStorage.setItem("user_id", "42");
    });

    it("realiza compra correctamente", async () => {
      const formData = { cliente: "Juan" };
      const userProducts = [
        { id: 1, cantidad_user_producto: 2 },
        { id: 2, cantidad_user_producto: 1 },
      ];

      const pedido = { data: { id: 10 } };
      const llenarResponse = { data: "llenado" };
      const factura = { data: { mensaje: "Factura creada" } };

      createPedido.mockResolvedValue(pedido);
      llenarPedidosProductos.mockResolvedValue(llenarResponse);
      generarFacturaPedido.mockResolvedValue(factura);
      vaciarCarrito.mockReturnValue("carrito vaciado");

      await authService.HacerCompra(formData, userProducts);

      expect(createPedido).toHaveBeenCalledWith(formData);
      expect(llenarPedidosProductos).toHaveBeenCalledWith([
        { cantidad_producto_carrito: 2, pedido_ppid: 10, producto_ppid: 1 },
        { cantidad_producto_carrito: 1, pedido_ppid: 10, producto_ppid: 2 },
      ]);
      expect(vaciarCarrito).toHaveBeenCalledWith("42");
      expect(generarFacturaPedido).toHaveBeenCalledWith(10);
    });

    it("captura errores en createPedido y aún así intenta continuar", async () => {
      createPedido.mockRejectedValue(new Error("Error al crear pedido"));
      llenarPedidosProductos.mockResolvedValue({ data: "ok" });
      generarFacturaPedido.mockResolvedValue({
        data: { mensaje: "Factura creada" },
      });
      vaciarCarrito.mockReturnValue("carrito vaciado");

      const consoleSpy = jest
        .spyOn(console, "log")
        .mockImplementation(() => {});
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await authService.HacerCompra({}, []);

      expect(console.log).toHaveBeenCalledWith(
        "error al crear Pedido",
        expect.any(Error)
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error al generar la factura:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it("captura errores en llenarPedidosProductos y continúa con factura", async () => {
      const pedidoMock = { data: { id: 123 } };

      createPedido.mockResolvedValue(pedidoMock);

      // `userProducts` simulados para formar la lista
      const userProducts = [
        { cantidad_user_producto: 2, id: 5 },
        { cantidad_user_producto: 1, id: 8 },
      ];

      llenarPedidosProductos.mockRejectedValue(
        new Error("Fallo en llenarPedidos")
      );
      generarFacturaPedido.mockResolvedValue({
        data: { mensaje: "Factura creada" },
      });
      vaciarCarrito.mockReturnValue("carrito vaciado");

      const consoleLogSpy = jest
        .spyOn(console, "log")
        .mockImplementation(() => {});
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await authService.HacerCompra({}, userProducts);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "error la llenarPedidosProduct",
        expect.any(Error)
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Factura generada:",
        "Factura creada"
      );

      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
