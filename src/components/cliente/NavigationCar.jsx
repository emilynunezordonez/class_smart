import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vaciarCarrito, searchUserProducts } from '../../api/products.api';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

export function NavigationCar({ total_global }) {
  const [hayProductos, setHayProductos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCarrito() {
      const res = await searchUserProducts(localStorage.getItem('user_id'));
      if (res.data.length !== 0) {
        console.log('retorno consulta carrito', res);
        setHayProductos(true);
      }
    }
    loadCarrito();
  }, []);

  const handleVaciarCarrito = async () => {
    const res = await vaciarCarrito(localStorage.getItem('user_id'));
    console.log(res);
    toast.success('Carrito vaciado exitosamente', {
      position: "bottom-right",
      style: {
        background: "#101010",
        color: "#fff"
      }
    });

    setTimeout(() => {
      location.reload();
    }, 2000);
  };

  const handleBackClick = () => {
    navigate("/client");
  };

  return (
    <div>
      <nav className="bg-[#0FA0CC] text-white p-5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="p-1 text-white hover:text-gray-900 transition duration-300 flex items-center"
              onClick={handleBackClick}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="ml-2">Back</span>
            </button>
            <ShoppingCart size={24} className="ml-4" />
          </div>

          <h2 className="text-xl font-bold">Tu carrito de compras</h2>

          <div className="flex space-x-4">
            <button
              className="text-xl font-bold text-white hover:scale-110 transition duration-300 ease-in-out"
              onClick={() => hayProductos ? navigate('/pasarela') : toast.error('No hay productos para comprar', {
                position: "top-right",
                style: {
                  background: "#101010",
                  color: "#fff"
                }
              })}
            >
              Comprar
            </button>

            <button
              className="text-xl font-bold text-white hover:text-red-600 hover:scale-110 transition duration-300 ease-in-out"
              onClick={handleVaciarCarrito}
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavigationCar;