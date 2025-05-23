import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { CarritoPage } from "../../../src/pages/cliente/CarritoPage";
import * as productsApi from "../../../src/api/products.api";
import { MemoryRouter, useParams } from "react-router-dom";

// filepath: /home/eminuor200441/GitHub/class_smart/__test__/pages/cliente/CarritoPage.test.jsx

// Mock components
jest.mock("../../../src/components/cliente/CarritoList", () => ({
    CarritoList: ({ set_total, Total, searchValue }) => (
        <div data-testid="carrito-list">
            CarritoList - Total: {Total} - searchValue: {searchValue}
        </div>
    ),
}));
jest.mock("../../../src/components/cliente/NavigationCar", () => ({
    NavigationCar: ({ total_global }) => (
        <div data-testid="navigation-car">NavigationCar - Total: {total_global}</div>
    ),
}));

// Mock useParams
jest.mock("react-router-dom", () => {
    const original = jest.requireActual("react-router-dom");
    return {
        ...original,
        useParams: jest.fn(),
    };
});

describe("CarritoPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem("user_id", "123");
        productsApi.searchUserProducts = jest.fn();
    });

    it("renders NavigationCar and CarritoList with correct props", async () => {
        // Mock useParams
        useParams.mockReturnValue({ id: "test-id" });

        // Mock API response
        productsApi.searchUserProducts.mockResolvedValue({
            data: [
                { cantidad_user_producto: 2, precio: 100 },
                { cantidad_user_producto: 1, precio: 50 },
            ],
        });

        render(
            <MemoryRouter>
                <CarritoPage />
            </MemoryRouter>
        );

        // Wait for useEffect to finish
        await waitFor(() =>
            expect(productsApi.searchUserProducts).toHaveBeenCalledWith("123")
        );

        // Total should be (2*100 + 1*50) = 250
        expect(screen.getByTestId("navigation-car")).toHaveTextContent("Total: 250");
        expect(screen.getByTestId("carrito-list")).toHaveTextContent(
            "CarritoList - Total: 250 - searchValue: test-id"
        );
        expect(
            screen.getByText(/Total : \$250/)
        ).toBeInTheDocument();
    });

    it("shows total as 0 if API returns empty array", async () => {
        useParams.mockReturnValue({ id: "empty" });
        productsApi.searchUserProducts.mockResolvedValue({ data: [] });

        render(
            <MemoryRouter>
                <CarritoPage />
            </MemoryRouter>
        );

        await waitFor(() =>
            expect(productsApi.searchUserProducts).toHaveBeenCalledWith("123")
        );

        expect(screen.getByTestId("navigation-car")).toHaveTextContent("Total: 0");
        expect(screen.getByTestId("carrito-list")).toHaveTextContent(
            "CarritoList - Total: 0 - searchValue: empty"
        );
        expect(
            screen.getByText(/Total : \$0/)
        ).toBeInTheDocument();
    });

    it("handles API error gracefully", async () => {
        useParams.mockReturnValue({ id: "error" });
        const errorSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        productsApi.searchUserProducts.mockRejectedValue(new Error("API error"));

        render(
            <MemoryRouter>
                <CarritoPage />
            </MemoryRouter>
        );

        await waitFor(() =>
            expect(productsApi.searchUserProducts).toHaveBeenCalledWith("123")
        );

        expect(errorSpy).toHaveBeenCalledWith(
            "Error al consultar los productos del usaurio",
            expect.any(Error)
        );
        expect(screen.getByTestId("navigation-car")).toHaveTextContent("Total: 0");
        expect(screen.getByTestId("carrito-list")).toHaveTextContent(
            "CarritoList - Total: 0 - searchValue: error"
        );
        errorSpy.mockRestore();
    });
});