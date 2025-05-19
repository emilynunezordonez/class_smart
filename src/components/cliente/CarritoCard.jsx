import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateCantidadProductoCarrito } from "../../api/products.api";


export function CarritoCard({ product ,set_total,Total}) {

    const navigate = useNavigate();
    
    const [cantidad,setCantidad]=useState(product.cantidad_user_producto)
    const [cantidadP,setCantidadP]=useState(product.cantidad_producto)
    const total=product.precio*cantidad
   

    
    const handlePlus= async ()=>{
       
        if(cantidadP>0){

            const nuevaCantidadUser=cantidad+1
            const nuevaCantidadProducto=cantidadP-1
            

            try {
                const res=await updateCantidadProductoCarrito(
                    product.id_user_product,
                    nuevaCantidadUser
                );

             

                

                setCantidad(res.data.cantidad_producto);
                setCantidadP(nuevaCantidadProducto);
            } catch (error) {
                console.error("Error al actualizar cantidades",error);
                
            }
            set_total(Total+parseFloat(product.precio))
            localStorage.setItem('total',Total)
            
        }
    };

    const handleSub=async()=>{

        if(cantidad>0){
            const nuevaCantidad=cantidad-1;
            const nuevaCantidadProducto= cantidadP+1

            try {
                const res= await updateCantidadProductoCarrito(
                    product.id_user_product,
                    nuevaCantidad

                );

                //  const res2= await partialUpdateProduct(
                //     product.id,
                //     nuevaCantidadProducto
                //  );

                 setCantidad(res.data.cantidad_producto)
                 setCantidadP(nuevaCantidadProducto)

            } catch (error) {
                console.log("error al actualizar las cantidades",error)
            }
            set_total(Total-parseFloat(product.precio))
            localStorage.setItem('total',Total)
            
        }
    }
    


 
   

  

    return (
        <div className="bg-withe p-3 rounded-md shadow-md hover:shadow-lg
        hover:cursor-pointer"

        >

         

            {product.foto_producto && (
                <img
                    src={product.foto_producto}
                    alt={product.nombre}
                    className="w-32 h-[120px] object-cover mb-3 rounded-md"
                />
            )}
            <h1 className="text-black font-bold uppercase">{product.nombre}</h1>
            <p className="text-gray-600">Cantidad a comprar: {cantidad}</p>
            <p className="text-gray-600">Cantidad disponible: {cantidadP}</p>
            <p className="text-gray-600">Precio: ${product.precio.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
            <p className="text-gray-600">Descripción: {product.descripcion}</p>
            <p className="text-gray-600">Total: ${total.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>

            <button className='bg-[#0FA0CC] p-3 rounded-lg w-48 mt-3 p-3 hover:bg-[#0c88ad]
        hover:cursor-pointer'
        onClick={()=>{ 
            
            handlePlus()
           
        

        }}
        >+</button>
        
        <button className='bg-red-500 p-3 rounded-lg w-48 mt-3 p-3 hover:bg-red-700
        hover:cursor-pointer'
        onClick={()=>{ 
            
            handleSub()
           
        

        }}
        >-</button>

        


        </div>

        

        
       
        
    );
}
