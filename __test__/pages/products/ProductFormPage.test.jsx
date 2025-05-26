import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductFormPage } from "../../../src/pages/products/ProductFormPage";

import * as productsApi from "../../../src/api/products.api";
import * as categoriesApi from "../../../src/api/categories.api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

// Mock react-hook-form
jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
}));

// Mock react-router-dom hooks
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

// Mock toast
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock API calls
jest.mock("../../../src/api/products.api");
jest.mock("../../../src/api/categories.api");

describe("ProductFormPage", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useNavigate to return our mock function
    useNavigate.mockReturnValue(mockNavigate);

    // Mock useForm to behave like real but minimal
    const register = jest.fn().mockReturnValue({});
    const handleSubmit = (fn) => (e) => {
      e.preventDefault();
      return fn({
        nombre: "Test Product",
        precio: 100,
        descripcion: "Test Desc",
        cantidad_producto: "5",
        estado_producto: "true",
        categoria: "TestCat",
        foto_producto: ["fileMock"],
      });
    };
    const formState = { errors: {} };
    const setValue = jest.fn();

    useForm.mockReturnValue({ register, handleSubmit, formState, setValue });
  });

  it("renderiza el formulario con campos", () => {
    useParams.mockReturnValue({});

    render(<ProductFormPage />);

    expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Precio")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Descripción")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Cantidad de producto disponible")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Categoría")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("crea un producto y navega correctamente", async () => {
    useParams.mockReturnValue({}); // Sin ID -> creación

    // Mock getAllCategories para que devuelva una categoría que coincida
    categoriesApi.getAllCategories.mockResolvedValue({
      data: [{ id: 1, nombre_categoria: "TestCat" }],
    });

    // Mock createProduct
    productsApi.createProduct.mockResolvedValue({});

    render(<ProductFormPage />);

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(categoriesApi.getAllCategories).toHaveBeenCalled();
      expect(productsApi.createProduct).toHaveBeenCalledWith({
        nombre: "Test Product",
        precio: 100,
        descripcion: "Test Desc",
        cantidad_producto: 5,
        estado_producto: true,
        categoria: 1,
        foto_producto: "fileMock",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Producto creado exitosamente",
        expect.objectContaining({ position: "bottom-right" })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/products");
    });
  });

  it("actualiza un producto y navega correctamente", async () => {
    useParams.mockReturnValue({ id: "123" }); // Con ID -> actualización

    // Mock getProduct con un producto válido con .data
    productsApi.getProduct.mockResolvedValue({
      data: {
        nombre: "Prod",
        precio: 50,
        descripcion: "Desc",
        cantidad_producto: 10,
        estado_producto: true,
        categoria: 1,
      },
    });

    // Mock categorías
    categoriesApi.getAllCategories.mockResolvedValue({
      data: [{ id: 1, nombre_categoria: "TestCat" }],
    });

    // Mock updateProduct
    productsApi.updateProduct.mockResolvedValue({});

    // Mock useForm para manejar handleSubmit correctamente
    const register = jest.fn().mockReturnValue({});
    const handleSubmit = (fn) => (e) => {
      e.preventDefault();
      return fn({
        nombre: "Test Product",
        precio: 100,
        descripcion: "Test Desc",
        cantidad_producto: "5",
        estado_producto: "true",
        categoria: "TestCat",
        foto_producto: ["fileMock"],
      });
    };
    const formState = { errors: {} };
    const setValue = jest.fn();
    useForm.mockReturnValue({ register, handleSubmit, formState, setValue });

    render(<ProductFormPage />);

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(productsApi.updateProduct).toHaveBeenCalledWith("123", {
        nombre: "Test Product",
        precio: 100,
        descripcion: "Test Desc",
        cantidad_producto: 5,
        estado_producto: true,
        categoria: 1, // la categoría se convierte en id 1
        foto_producto: "fileMock",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Producto actualizado correctamente",
        expect.objectContaining({ position: "bottom-right" })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/products");
    });
  });

  it("muestra error si no encuentra categoría", async () => {
    useParams.mockReturnValue({});

    categoriesApi.getAllCategories.mockResolvedValue({ data: [] }); // no categorías

    render(<ProductFormPage />);

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Categoría no encontrada",
        expect.objectContaining({ position: "bottom-right" })
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("muestra error si falla la petición", async () => {
    useParams.mockReturnValue({});

    categoriesApi.getAllCategories.mockRejectedValue(new Error("fail"));

    render(<ProductFormPage />);

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Ocurrió un error",
        expect.objectContaining({ position: "bottom-right" })
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("navega a /products al hacer click en el botón Back", () => {
    useParams.mockReturnValue({});
    render(<ProductFormPage />);

    fireEvent.click(screen.getByText(/Back/i));

    expect(mockNavigate).toHaveBeenCalledWith("/products");
  });

  it("carga producto y categorías si params.id existe", async () => {
    useParams.mockReturnValue({ id: "123" });

    const mockProduct = {
      data: {
        nombre: "Prod",
        precio: 50,
        descripcion: "Desc",
        cantidad_producto: 10,
        estado_producto: true,
        categoria: 1,
      },
    };

    productsApi.getProduct.mockResolvedValue(mockProduct);
    categoriesApi.getAllCategories.mockResolvedValue({
      data: [{ id: 1, nombre_categoria: "Cat1" }],
    });

    const setValue = jest.fn();

    // Actualizamos mock de useForm para obtener setValue real
    useForm.mockReturnValue({
      register: jest.fn().mockReturnValue({}),
      handleSubmit: (fn) => fn,
      formState: { errors: {} },
      setValue,
    });

    render(<ProductFormPage />);

    // Esperar a que se llame setValue con datos cargados
    await waitFor(() => {
      expect(productsApi.getProduct).toHaveBeenCalledWith("123");
      expect(categoriesApi.getAllCategories).toHaveBeenCalled();
      expect(setValue).toHaveBeenCalledWith("nombre", "Prod");
      expect(setValue).toHaveBeenCalledWith("precio", 50);
      expect(setValue).toHaveBeenCalledWith("descripcion", "Desc");
      expect(setValue).toHaveBeenCalledWith("cantidad_producto", "10");
      expect(setValue).toHaveBeenCalledWith("categoria", "Cat1");
      expect(setValue).toHaveBeenCalledWith("estado_producto", "true");
    });
  });

  it("elimina producto tras confirmación y navega", async () => {
    useParams.mockReturnValue({ id: "123" });

    render(<ProductFormPage />);

    // Mock window.confirm a true (aceptado)
    window.confirm = jest.fn(() => true);

    productsApi.deleteProduct.mockResolvedValue({});

    // Botón Delete solo aparece si params.id existe
    const btnDelete = screen.getByText("Delete");

    fireEvent.click(btnDelete);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(productsApi.deleteProduct).toHaveBeenCalledWith("123");
      expect(toast.success).toHaveBeenCalledWith(
        "Producto eliminado exitosamente",
        expect.objectContaining({ position: "bottom-right" })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/products");
    });
  });

  it("no elimina producto si confirma cancelación", () => {
    useParams.mockReturnValue({ id: "123" });

    render(<ProductFormPage />);

    window.confirm = jest.fn(() => false);

    const btnDelete = screen.getByText("Delete");

    fireEvent.click(btnDelete);

    expect(window.confirm).toHaveBeenCalled();
    expect(productsApi.deleteProduct).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("muestra error al eliminar si API falla", async () => {
    useParams.mockReturnValue({ id: "123" });

    render(<ProductFormPage />);

    window.confirm = jest.fn(() => true);

    productsApi.deleteProduct.mockRejectedValue(new Error("fail"));

    const btnDelete = screen.getByText("Delete");

    fireEvent.click(btnDelete);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "No tiene permiso para realizar esta acción",
        expect.objectContaining({ position: "bottom-right" })
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
