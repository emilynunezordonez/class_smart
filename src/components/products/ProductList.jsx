import { useEffect, useState } from "react"
import { getAllProducts,searchProducts } from "../../api/products.api"
import { ProductCard } from "./ProductCard"
export function ProductList({ searchCriteria, searchValue }) {

  const [products, setProducts] = useState([])
  
  useEffect(() => {
    async function loadProducts() {
      try {

        


        if (searchCriteria!=undefined && searchValue!=undefined) {
          
          const res = await searchProducts(searchCriteria,searchValue)
          
          setProducts(res.data['products'])

        } else {
          const res = await getAllProducts()
          console.log(res.data)
          setProducts(res.data)
        }
      } catch {
        console.log("Error al cargar los datos")
      }

    }
    loadProducts()
  }, [searchCriteria,searchValue])

  return (
    <div className="grid grid-cols-3 gap-3">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}

    </div>
  )
}
