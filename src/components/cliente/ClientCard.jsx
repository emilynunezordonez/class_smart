import { useNavigate } from "react-router-dom";
import { insertarCarrito, searchUserProducts,createFavorito,deleteFavorito,getAllFavoritos } from "../../api/products.api";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import React from 'react';
import { ShoppingCart, Plus, Star} from 'lucide-react';
import { authService } from '../../services/authService';

export function ClientCard({ product }) {
    const navigate = useNavigate();
    const [isFavorito, setIsFavorito] = useState(false);
    const [favoritos, setFavoritos] = useState(null);

    useEffect(() => {
        async function fetchFavoritos () {
            try {
                const userid = parseInt(localStorage.getItem('user_id'))
                const response = await getAllFavoritos();
                const filteredFavoritos = response.data.filter(favorito => favorito.usuario === userid && favorito.producto === product.id);
                if (filteredFavoritos.length > 0) {
                    setIsFavorito(true);
                    setFavoritos(filteredFavoritos[0]);
                }
            } catch (error) {
                console.error('Error fetching favoritos:', error);
            }
        };
        fetchFavoritos();
    }, []);

    const handleInsertar = async () => {
        if(!localStorage.getItem('user_id')){
            navigate('/login')
        } else {
            const res1 = await searchUserProducts(localStorage.getItem('user_id'));
            console.log(res1.data)
            console.log(localStorage.getItem('user_id'))

            const productos = res1.data
            const product_exist = productos.find(element => element.id === product.id) 

            if (!product_exist) {
                const carrito = {
                    cantidad_producto: 0,
                    usuario: parseInt(localStorage.getItem('user_id')),
                    producto: product.id
                }
                try {
                    const res = await insertarCarrito(carrito)
                    console.log(res)
                    toast.success('Agregado al carrito exitosamente', {
                        position: "bottom-right",
                        style: {
                            background: "#101010",
                            color: "#fff"
                        }
                    });
                } catch (error) {
                    toast.error('Error al agregar al carrito', {
                        position: "bottom-right",
                        style: {
                            background: "#101010",
                            color: "#fff"
                        }
                    })
                }
            } else {
                toast.success('Ya agregaste este producto al carrito', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff"
                    }
                })
            }
        }
    }

    const handleStarClick = async () => {
        if (isFavorito) {
            // Si ya es favorito, eliminar de favoritos
            try {
                console.log(favoritos);
                console.log(favoritos.id);
                await deleteFavorito(favoritos.id);
                setIsFavorito(false);
                /*setFavorito([]);*/
                toast.success('Producto eliminado de favoritos', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff"
                    }
                })
            } catch (error) {
                console.error(error);
                toast.error('Error al eliminar el producto de favoritos');
            }
        } else {
            // Si no es favorito, añadir a favoritos
            try {
                const newData={
                    usuario:parseInt(localStorage.getItem('user_id')),
                    producto:product.id
                }
                const res = await createFavorito(newData);
                setFavoritos(res.data);
                console.log(res.data);
                console.log(favoritos);
                setIsFavorito(true);
                toast.success('Producto añadido a favoritos', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff"
                    }
                })
            } catch (error) {
                toast.error('Error al añadir el producto a favoritos');
            }
        }
    };

    return (
        <div className="relative text-black rounded-lg p-3 hover:bg-gray-200 hover:cursor-pointer">
            {isFavorito && <button 
                className='absolute top-3 right-20 z-10 flex items-center justify-center p-2 text-white rounded-full w-15 h-10 hover:bg-indigo-700 hover:cursor-pointer'
                style={{ backgroundColor: "#0A546A" }}
                onClick={handleStarClick}
            >
                <Star size={20} />
            </button>}
            {!isFavorito && <button 
                className='absolute top-3 right-20 z-10 flex items-center justify-center p-2 text-white rounded-full w-15 h-10 hover:bg-indigo-700 hover:cursor-pointer'
                style={{ backgroundColor: "#0FA0CC" }}
                onClick={handleStarClick}
            >
                <Star size={20} />
            </button>}

            {/* Cart Button positioned absolutely in the top-right corner */}
            <button 
                className='absolute top-3 right-3 z-10 flex items-center justify-center p-2 text-white rounded-full w-15 h-10 hover:bg-indigo-700 hover:cursor-pointer'
                style={{ backgroundColor: "#0FA0CC" }}
                onClick={handleInsertar}
            >
                <div className="flex items-center">
                    <ShoppingCart size={20} />
                    <Plus size={16} className="ml-1" />
                </div>
            </button>
            {product.foto_producto && (
                <img
                    src={product.foto_producto}
                    alt={product.nombre}
                    className="w-32 h-[120px] object-cover mb-3 rounded-md"
                />
            )}
            <h1 className="font-bold uppercase">{product.nombre}</h1>
            <p className="text-slate-400">{product.cantidad_producto}</p>
            <p className="text-slate-400">{product.precio}</p>
            <p className="text-slate-400">{product.descripcion}</p>
            
            {/* CREAR ENTRADA EN LA BASE DE DATOS DE PRODUCTOUSUARIO */}

            
        </div>
    );
}