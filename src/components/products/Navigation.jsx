import { Link } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Plus, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../api/categories.api";
import { NavLink } from 'react-router-dom'


export function Navigation() {

  const [searchCriteria, setSearchCriteria] = useState('nombre')

  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    async function loadCategorias() {

      const res = await getAllCategories()

      setCategorias(res.data)

    }

    loadCategorias()

  }, [])

  const navigate = useNavigate();

  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleProductDropdown = () => {
    setIsProductDropdownOpen(!isProductDropdownOpen);
    setIsCategoryDropdownOpen(false);
  };

  const toggleCategoryDropdown = (e) => {
    e.stopPropagation();
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
   
    navigate('/products/' + searchCriteria + '/' + searchTerm)

    
  };

  return (
  
    <nav className="text-white p-4" style={{ backgroundColor: "#0FA0CC" }}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo o Título */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `text-xl font-bold hover:scale-110 transition-transform duration-300 ease-in-out ${isActive ? 'scale-100' : 'text-white'
            }`
          }
        >
          Productos
        </NavLink>
        <Link
          to='/users'
          className="text-xl font-bold hover:scale-110 transition-transform duration-300 ease-in-out"
        >
          Usuarios
        </Link>
        <Link
          to='/categorias'
          className="text-xl font-bold hover:scale-110 transition-transform duration-300 ease-in-out"
        >
          Categorias
        </Link>
        <Link
          to='/pedidos'
          className="text-xl font-bold hover:scale-110 transition-transform duration-300 ease-in-out"
        >
          Pedidos
        </Link>

        <Link
          to="/dashboard"
          className="text-xl font-bold hover:scale-110 transition-transform duration-300 ease-in-out"
        >
          Dashboard
        </Link>




        {/* Menú de Navegación */}
        <div className="relative flex items-center space-x-4">
          {/* Ícono de Búsqueda */}
          <div
            className="cursor-pointer"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={24} />
          </div>
        </div>

        {/* Barra de Búsqueda */}
        {isSearchOpen && (
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
                className="mt-4 w-full bg-[#0FA0CC] py-2 rounded-lg hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

      </div>


      {/* Botón de Salir */}
      <div className="fixed bottom-4 left-4">
        <button
          className="text-white p-2 rounded-full shadow-lg transition duration-300 transform hover:scale-110"
          style={{ backgroundColor: "#0FA0CC" }}
          onClick={() => {
            localStorage.removeItem('authToken');
            navigate('/login');
          }}
        >
          <LogOut size={24} />
        </button>
      </div>

      {/* Botón de opciones adicionales */}
      <div className="fixed bottom-4 right-4">
        <div className="relative">
          <button
            className="text-white p-4 rounded-full shadow-lg transition duration-300 transform hover:scale-110"
            style={{ backgroundColor: "#0FA0CC" }}
            onClick={toggleProductDropdown}
          >
            <Plus size={24} />
          </button>
          {isProductDropdownOpen && (
            <div
              onMouseEnter={() => setIsProductDropdownOpen(true)}
              onMouseLeave={() => setIsProductDropdownOpen(false)}
              className="absolute bottom-full right-0 mb-2 bg-white text-black shadow-lg rounded-md w-48 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="py-2">
              <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate('/client');
                    setIsProductDropdownOpen(false);
                  }}
                >
                  Ir a Seccion del Cliente
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate('/product-create');
                    setIsProductDropdownOpen(false);
                  }}
                >
                  Crear Producto
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
                  onClick={toggleCategoryDropdown}
                >
                  <div className="flex items-center justify-between">
                    Ver por categoría <ChevronDown size={16} />
                  </div>
                  {isCategoryDropdownOpen && (
                    <div
                      onMouseEnter={() => setIsProductDropdownOpen(true)}
                      onMouseLeave={() => setIsProductDropdownOpen(false)}
                      className="absolute bottom-0 right-full bg-white text-black shadow-lg rounded-md w-48 z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ul className="py-2">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate('/products')
                            setIsProductDropdownOpen(false);
                          }}
                        >
                          Ver Todo
                        </li>
                        {categorias.map(categoria => (
                          <li key={categoria.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate('/products/categoria_id/' + categoria.id)
                              setIsProductDropdownOpen(false);
                            }}
                          >
                            {categoria.nombre_categoria}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}