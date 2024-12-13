import { Link } from "react-router-dom"
import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../api/categories.api";
import { ChevronDown, Search, Plus, LogOut, Filter } from 'lucide-react';
import logo from '../../assets/logo/clasSmart.png'




export function Navigation() {

  const [searchCriteria, setSearchCriteria] = useState('nombre')

  const [categorias, setCategorias] = useState([])

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
   
  };


  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);




  useEffect(() => {
    async function loadCategorias() {

      const res = await getAllCategories()

      setCategorias(res.data)

    }


    loadCategorias()

  }, [])

  const navigate = useNavigate();

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCarOpen, setIsCarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');



  const toggleCategoryDropdown = (e) => {
    e.stopPropagation();
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };



  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando producto:', searchTerm);
    console.log(searchCriteria)
    navigate('/client/' + searchCriteria + '/' + searchTerm)



  };

  return (

    <nav className="text-white p-4 " 
    style={{ backgroundColor: "#0FA0CC" }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo o Título */}
        <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-8" />
        </div>

        <Link
          className="text-2xl text-black font-bold ml-[-90px]"
          to='/client'

        >
          ClasSmart
        </Link>

      

        <div></div>

        <div></div>

        <div></div>

        <Link
          to="/client/nosotros"

          className="text-xl font-bold hover:scale-110 transition-transform duration-300 ease-in-out"

        >
         
          Nosotros
        </Link>




        <button
          className="text-xl font-bold hover:scale-110 transition-transform duration-300 ease-in-out"
          onClick={() => {
            const authToken = localStorage.getItem('authToken')
            if (authToken) {
              navigate('/carrito/' + localStorage.getItem('user_id'))
            } else {
              navigate('/login')
            }

          }}
          
        >
          Carrito
        </button>



        {/* CARRITO */}
        <Link
          to="/clientFavorites"
          className="text-xl font-bold hover:scale-110 transition-transform duration-300 ease-in-out"
        >
          Favoritos
        </Link>
        


     


        {/* Barra de Búsqueda */}
        {
          isSearchOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    placeholder={"Buscar producto por " + searchCriteria}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  />
                  <button
                    type="submit"
                    className="bg-[#0FA0CC] text-white px-4 py-2 rounded-r-lg hover:bg-[#0c88ad]"
                  >
                    <Search size={20} />
                  </button>
                </form>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black mt-3" name="busqueda"
                  onChange={(e) => setSearchCriteria(e.target.value)}

                >
                  <option value="nombre">Nombre</option>
                  <option value="precio" >Precio</option>
                  <option value="estado_producto">Estado</option>
                  <option value="cantidad_producto">Cantidad</option>
                  
                </select>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="mt-4 w-full bg-[#0FA0CC] py-2 rounded-lg hover:bg-red-500"

                >
                  Cancelar
                </button>
              </div>
            </div>
          )
        }

        {!localStorage.getItem('authToken') && (
          <button
          className="text-xl font-bold hover:scale-110 transition-transform shadow-lg duration-300 ease-in-out"
          onClick={() => {
            navigate('/login')
          }}
        >
        Regístrate
          </button>
        )}


        {localStorage.getItem('authToken') ? (
          <div className="fixed bottom-4 left-4">
            <button
              className="text-white p-2 rounded-full shadow-lg transition duration-300 transform hover:scale-110"
              style={{ backgroundColor: "#0FA0CC" }}
              onClick={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user_id')
                navigate('/client');
              }}
            >
              <LogOut size={24} />
            </button>
          </div>
        ) : (<Link
          to='/login'
          className="text-xl font-bold hover:scale-110 shadow-lg transition-transform duration-300 ease-in-out"

        >
          LogIn
        </Link>)}




        <div
          className="cursor-pointer"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search size={24} />
        </div>




        {/* BOTON DE OPCIONES ADICIONALES */}
        <div className="fixed bottom-4 right-4">
          <div className="relative">
            <button
              className="text-white p-4 rounded-full shadow-lg transition duration-300 transform hover:scale-110"
              style={{ backgroundColor: "#0FA0CC" }}
              onClick={toggleUserDropdown}
            >
              <Filter size={24} />
            </button>
            {isUserDropdownOpen && (
              <div
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
                className="absolute bottom-full right-0 mb-2 bg-white text-black shadow-lg rounded-md w-48 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <ul className="py-2">
                  <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/client');
                    setIsCategoryDropdownOpen(false);
                  }}
                >
                  Ver todo
                </li>
                {categorias.map(categoria => (
                  

                  <li key={categoria.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/client/categoria_id/' + categoria.id)
                      setIsCategoryDropdownOpen(false);

                    }}

                  >
                    {categoria.nombre_categoria}
                  </li>
                ))}


              </ul>
              </div>
            )}
          </div>
        </div>




      </div >
    </nav >


  )
}