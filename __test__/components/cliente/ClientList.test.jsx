import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { ClientList } from "../../../src/components/cliente/ClientList";
import { searchProducts } from "../../../src/api/products.api";

// Mock ClientCard
jest.mock("../../../src/components/cliente/ClientCard", () => ({
    ClientCard: ({ product }) => <div data-testid="client-card">{product.name}</div>,
}));

// Mock searchProducts
jest.mock("../../../src/api/products.api", () => ({
    searchProducts: jest.fn(),
}));

describe("ClientList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders products returned by searchProducts with default criteria", async () => {
        searchProducts.mockResolvedValueOnce({
            data: { products: [{ id: 1, name: "Product A" }, { id: 2, name: "Product B" }] },
        });

        render(<ClientList />);

        await waitFor(() => {
            expect(searchProducts).toHaveBeenCalledWith("estado_producto", "activo");
            expect(screen.getAllByTestId("client-card")).toHaveLength(2);
            expect(screen.getByText("Product A")).toBeInTheDocument();
            expect(screen.getByText("Product B")).toBeInTheDocument();
        });
    });

    it("renders products returned by searchProducts with custom criteria", async () => {
        searchProducts.mockResolvedValueOnce({
            data: { products: [{ id: 3, name: "Product C" }] },
        });

        render(<ClientList searchCriteria="categoria" searchValue="electronica" />);

        await waitFor(() => {
            expect(searchProducts).toHaveBeenCalledWith("categoria", "electronica");
            expect(screen.getByText("Product C")).toBeInTheDocument();
        });
    });

    it("renders no products if API returns empty array", async () => {
        searchProducts.mockResolvedValueOnce({
            data: { products: [] },
        });

        render(<ClientList searchCriteria="categoria" searchValue="vacio" />);

        await waitFor(() => {
            expect(screen.queryByTestId("client-card")).not.toBeInTheDocument();
        });
    });

    it("handles API error gracefully", async () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        searchProducts.mockRejectedValueOnce(new Error("API error"));

        render(<ClientList searchCriteria="categoria" searchValue="error" />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Error al cargar los datos");
        });

        consoleSpy.mockRestore();
    });
});