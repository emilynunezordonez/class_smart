import { useEffect, useState } from "react"
import { searchProducts } from "../../api/products.api"
import { ClientCard } from "./ClientCard"
export function ClientList({ searchCriteria, searchValue }) {

  const [products, setProducts] = useState([])
  
  useEffect(() => {
    async function loadProducts() {
      try {

        
        console.log(searchCriteria)

        if (searchCriteria!=undefined && searchValue!=undefined) {
          
          const res = await searchProducts(searchCriteria,searchValue)
          
          setProducts(res.data['products'])

        } else {
          const res = await searchProducts('estado_producto','activo')
          
          setProducts(res.data['products'])
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
        <ClientCard key={product.id} product={product} />
      ))}

    </div>
  )
}
