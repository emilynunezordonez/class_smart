import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { ProductList } from "../../../src/components/products/ProductList"
import '@testing-library/jest-dom'


// Mock de products.api para evitar importar import.meta.env
jest.mock("../../../src/api/products.api", () => ({
  getAllProducts: jest.fn(),
  searchProducts: jest.fn(),
}))

import { getAllProducts, searchProducts } from "../../../src/api/products.api"

// Mock del componente ProductCard
jest.mock("../../../src/components/products/ProductCard", () => ({
  ProductCard: ({ product }) => <div data-testid="product-card">{product.name}</div>
}))

describe("ProductList", () => {
  const mockProducts = [
    { id: 1, name: "Producto 1" },
    { id: 2, name: "Producto 2" },
    { id: 3, name: "Producto 3" }
  ]

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("carga todos los productos si no hay búsqueda", async () => {
    getAllProducts.mockResolvedValue({ data: mockProducts })

    render(<ProductList />)

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalled()
      expect(screen.getAllByTestId("product-card")).toHaveLength(3)
    })
  })

  it("usa búsqueda si se pasan criterios", async () => {
    searchProducts.mockResolvedValue({ data: { products: mockProducts } })

    render(<ProductList searchCriteria="name" searchValue="Producto" />)

    await waitFor(() => {
      expect(searchProducts).toHaveBeenCalledWith("name", "Producto")
      expect(screen.getAllByTestId("product-card")).toHaveLength(3)
    })
  })

  it("maneja errores sin romperse", async () => {
    console.error = jest.fn()
    getAllProducts.mockRejectedValue(new Error("Error"))

    render(<ProductList />)

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalled()
    })
  })
})
