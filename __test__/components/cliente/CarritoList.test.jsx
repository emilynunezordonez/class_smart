import React from "react";
import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import { CarritoList } from "../../../src/components/cliente/CarritoList";
import * as productsApi from "../../../src/api/products.api";

// filepath: /home/eminuor200441/GitHub/class_smart/__test__/components/cliente/CarritoList.test.jsx

// Mock CarritoCard component
jest.mock("../../../src/components/cliente/CarritoCard", () => ({
    CarritoCard: ({ product }) => <div data-testid="carrito-card">{product.name}</div>,
}));

// Mock image import
jest.mock("../../../src/images/carrito.png", () => "carrito.png");

// Mock searchUserProducts
const mockSearchUserProducts = jest.spyOn(productsApi, "searchUserProducts");

describe("CarritoList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders empty cart message and image when no products", async () => {
        mockSearchUserProducts.mockResolvedValueOnce({ data: [] });

        render(
            <CarritoList searchValue="user1" set_total={jest.fn()} Total={0} />
        );

        await waitFor(() => {
            expect(
                screen.getByText("Tu carrito está vacío. ¡Agrega algunos productos!")
            ).toBeInTheDocument();
            expect(screen.getByAltText("carrito")).toBeInTheDocument();
        });
    });

    it("renders CarritoCard for each product returned", async () => {
        const products = [
            { id: 1, name: "Producto 1" },
            { id: 2, name: "Producto 2" },
        ];
        mockSearchUserProducts.mockResolvedValueOnce({ data: products });

        render(
            <CarritoList searchValue="user2" set_total={jest.fn()} Total={0} />
        );

        await waitFor(() => {
            expect(screen.getAllByTestId("carrito-card")).toHaveLength(2);
            expect(screen.getByText("Producto 1")).toBeInTheDocument();
            expect(screen.getByText("Producto 2")).toBeInTheDocument();
        });
    });

    it("does not call API if searchValue is undefined", async () => {
        render(
            <CarritoList searchValue={undefined} set_total={jest.fn()} Total={0} />
        );
        await waitFor(() => {
            expect(mockSearchUserProducts).not.toHaveBeenCalled();
        });
        expect(
            screen.getByText("Tu carrito está vacío. ¡Agrega algunos productos!")
        ).toBeInTheDocument();
    });

    it("handles API error gracefully", async () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        mockSearchUserProducts.mockRejectedValueOnce(new Error("API error"));

        render(
            <CarritoList searchValue="user3" set_total={jest.fn()} Total={0} />
        );

        await waitFor(() => {
            expect(
                screen.getByText("Tu carrito está vacío. ¡Agrega algunos productos!")
            ).toBeInTheDocument();
            expect(consoleSpy).toHaveBeenCalledWith("Error al cargar los datos");
        });

        consoleSpy.mockRestore();
    });
});