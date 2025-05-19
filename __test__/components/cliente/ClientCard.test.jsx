import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ClientCard } from "../../../src/components/cliente/ClientCard";
import * as productsApi from "../../../src/api/products.api";
import { BrowserRouter } from "react-router-dom";
import toast from "react-hot-toast";

// filepath: /home/eminuor200441/GitHub/class_smart/__test__/components/cliente/ClientCard.test.jsx

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
    ShoppingCart: () => <svg data-testid="shopping-cart" />,
    Plus: () => <svg data-testid="plus" />,
    Star: (props) => <svg data-testid="star" {...props} />,
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        clear: jest.fn(() => { store = {}; }),
        removeItem: jest.fn((key) => { delete store[key]; }),
    };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const product = {
    id: 1,
    nombre: "Producto Test",
    cantidad_producto: 5,
    precio: 100,
    descripcion: "Descripcion de prueba",
    foto_producto: "http://test.com/img.jpg",
};

function renderWithRouter(ui) {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("ClientCard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.localStorage.clear();
    });

    it("renders product info", () => {
        renderWithRouter(<ClientCard product={product} />);
        expect(screen.getByText(/Producto Test/i)).toBeInTheDocument();
        expect(screen.getByText(/Descripcion de prueba/i)).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("100")).toBeInTheDocument();
        expect(screen.getByAltText("Producto Test")).toHaveAttribute("src", product.foto_producto);
    });

    it("shows star button and cart button", () => {
        renderWithRouter(<ClientCard product={product} />);
        expect(screen.getAllByTestId("star")[0]).toBeInTheDocument();
        expect(screen.getByTestId("shopping-cart")).toBeInTheDocument();
        expect(screen.getByTestId("plus")).toBeInTheDocument();
    });

    it("navigates to login if user_id not in localStorage when adding to cart", async () => {
        productsApi.searchUserProducts = jest.fn();
        renderWithRouter(<ClientCard product={product} />);
        fireEvent.click(screen.getByTestId("shopping-cart").parentElement.parentElement);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    it("adds product to cart if not already added", async () => {
        window.localStorage.setItem("user_id", "2");
        productsApi.searchUserProducts = jest.fn().mockResolvedValue({ data: [] });
        productsApi.insertarCarrito = jest.fn().mockResolvedValue({ data: {} });

        renderWithRouter(<ClientCard product={product} />);
        fireEvent.click(screen.getByTestId("shopping-cart").parentElement.parentElement);

        await waitFor(() => {
            expect(productsApi.insertarCarrito).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith(
                "Agregado al carrito exitosamente",
                expect.any(Object)
            );
        });
    });

    it("shows toast if product already in cart", async () => {
        window.localStorage.setItem("user_id", "2");
        productsApi.searchUserProducts = jest.fn().mockResolvedValue({ data: [{ id: 1 }] });

        renderWithRouter(<ClientCard product={product} />);
        fireEvent.click(screen.getByTestId("shopping-cart").parentElement.parentElement);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                "Ya agregaste este producto al carrito",
                expect.any(Object)
            );
        });
    });

    it("fetches favoritos and sets isFavorito if exists", async () => {
        window.localStorage.setItem("user_id", "2");
        productsApi.getAllFavoritos = jest.fn().mockResolvedValue({
            data: [{ id: 10, usuario: 2, producto: 1 }],
        });

        renderWithRouter(<ClientCard product={product} />);
        await waitFor(() => {
            expect(productsApi.getAllFavoritos).toHaveBeenCalled();
            // Star button with favorito color should be rendered
            expect(screen.getAllByTestId("star")[0]).toBeInTheDocument();
        });
    });

    it("adds product to favoritos when star clicked and not favorito", async () => {
        window.localStorage.setItem("user_id", "2");
        productsApi.getAllFavoritos = jest.fn().mockResolvedValue({ data: [] });
        productsApi.createFavorito = jest.fn().mockResolvedValue({ data: { id: 99 } });

        renderWithRouter(<ClientCard product={product} />);
        fireEvent.click(screen.getAllByTestId("star")[0].parentElement);

        await waitFor(() => {
            expect(productsApi.createFavorito).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith(
                "Producto añadido a favoritos",
                expect.any(Object)
            );
        });
    });

    it("removes product from favoritos when star clicked and is favorito", async () => {
        window.localStorage.setItem("user_id", "2");
        productsApi.getAllFavoritos = jest.fn().mockResolvedValue({
            data: [{ id: 10, usuario: 2, producto: 1 }],
        });
        productsApi.deleteFavorito = jest.fn().mockResolvedValue({});

        renderWithRouter(<ClientCard product={product} />);
        // Wait for favoritos to be fetched and isFavorito to be true
        await waitFor(() => {
            expect(productsApi.getAllFavoritos).toHaveBeenCalled();
        });
        fireEvent.click(screen.getAllByTestId("star")[0].parentElement);

        await waitFor(() => {
            expect(productsApi.deleteFavorito).toHaveBeenCalledWith(10);
            expect(toast.success).toHaveBeenCalledWith(
                "Producto eliminado de favoritos",
                expect.any(Object)
            );
        });
    });

    // ...existing code...

it("muestra toast de error si falla al agregar al carrito", async () => {
    window.localStorage.setItem("user_id", "2");
    productsApi.searchUserProducts = jest.fn().mockResolvedValue({ data: [] });
    productsApi.insertarCarrito = jest.fn().mockRejectedValue(new Error("fail"));

    renderWithRouter(<ClientCard product={product} />);
    fireEvent.click(screen.getByTestId("shopping-cart").parentElement.parentElement);

    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
            "Error al agregar al carrito",
            expect.any(Object)
        );
    });
});

it("muestra toast de error si falla al añadir a favoritos", async () => {
    window.localStorage.setItem("user_id", "2");
    productsApi.getAllFavoritos = jest.fn().mockResolvedValue({ data: [] });
    productsApi.createFavorito = jest.fn().mockRejectedValue(new Error("fail"));

    renderWithRouter(<ClientCard product={product} />);
    fireEvent.click(screen.getAllByTestId("star")[0].parentElement);

    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
            "Error al añadir el producto a favoritos"
        );
    });
});

it("muestra toast de error si falla al eliminar de favoritos", async () => {
    window.localStorage.setItem("user_id", "2");
    productsApi.getAllFavoritos = jest.fn().mockResolvedValue({
        data: [{ id: 10, usuario: 2, producto: 1 }],
    });
    productsApi.deleteFavorito = jest.fn().mockRejectedValue(new Error("fail"));

    renderWithRouter(<ClientCard product={product} />);
    await waitFor(() => {
        expect(productsApi.getAllFavoritos).toHaveBeenCalled();
    });
    fireEvent.click(screen.getAllByTestId("star")[0].parentElement);

    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
            "Error al eliminar el producto de favoritos"
        );
    });
});
});