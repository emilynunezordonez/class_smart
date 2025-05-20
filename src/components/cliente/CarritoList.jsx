import { useEffect, useState } from "react"
import { searchUserProducts } from '../../api/products.api'
import { CarritoCard } from "./CarritoCard"
import carrito from '../../images/carrito.png'

import { useNavigate } from 'react-router-dom'
export function CarritoList({searchValue, set_total,Total}) {

  const [products, setProducts] = useState([])


  
  useEffect(() => {
    async function loadProducts() {
      try {




        if (searchValue != undefined) {
          const res = await searchUserProducts(searchValue)

          setProducts(res.data)

        }



      } catch {
        console.log("Error al cargar los datos")
      }

    }
    loadProducts()
  }, [searchValue])



  return (
    <div className="grid grid-cols-3 gap-3">
      {products && products.length > 0 ? (products.map(product => (
        <CarritoCard key={product.id} product={product} set_total={set_total} Total={Total} />
      ))) : (
        <div className="mx-auto">
          <p className="text-center text-gray-500">Tu carrito está vacío. ¡Agrega algunos productos!</p>
          <img className="w-40 h-30 object-contain p-1" src={carrito} alt="carrito" />
        </div>

      )}

      

    </div>
  )
}