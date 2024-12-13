import { useNavigate } from "react-router-dom";

export function ProductCard({product}) {

    const navigate=useNavigate();

    return (
        <div className="bg-white p-3 hover:bg-gray-200 transition duration-300 ease-in-out
        hover:cursor-pointer"

        onClick={()=>{
            navigate('/product-create/'+product.id)
        }}
        >
            
            {product.foto_producto && (
               <img 
               src={product.foto_producto} 
               alt={product.nombre}
               className="w-32 h-[120px] object-cover mb-3 rounded-md"
           />
            )}
            <h1 className="font-bold uppercase text-black">{product.nombre}</h1>
            <p className="text-black">${product.precio}</p>
            <p className="text-black opacity-40">Disponibles: {product.cantidad_producto}</p>
            <p className="text-black opacity-40">Descripción: {product.descripcion}</p>
            
        </div>
    );
}

