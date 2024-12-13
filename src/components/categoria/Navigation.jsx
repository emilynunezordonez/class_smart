import { Link } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, Search, Plus, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../api/categories.api";
import { searchProducts } from "../../api/products.api";
import { NavLink } from 'react-router-dom'


export function Navigation() {

  const [searchCriteria, setSearchCriteria] = useState('categoria')

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
    // Lógica de búsqueda
    console.log('Buscando producto:', searchTerm);
    console.log(searchCriteria)
    navigate('/categoriasBusqueda/' + searchTerm)

    // Aquí podrías llamar a una función de búsqueda en tu backend o estado global
  };

  return (
    // <div className="flex justify-between py-3">

    //     <Link to="/products">Products List</Link>

    //   <button className="bg-indigo-500 px-3 py-2 rounded-lg">

    //     <Link to="/product-create" >Create Product</Link>

    //   </button>

    // </div>

    <nav className="text-white p-4" style={{ backgroundColor: "#0FA0CC" }}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo o Título */}
        <Link
          to="/products"
          className="text-xl font-bold hover:scale-110 transition-transform duration-300 ease-in-out"
        >
          Productos
        </Link>
        <Link
          to='/users'
          className="text-xl font-bold hover:scale-110 transition-transform duration-300 ease-in-out"
        >
          Usuarios
        </Link>
        <NavLink
          to="/categorias"
          className={({ isActive }) =>
            `text-xl font-bold hover:scale-110 transition-transform duration-300 ease-in-out ${isActive ? 'scale-100' : 'text-white'
            }`
          }
        >
          Categorias
        </NavLink>
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
              //absolute top-full left-0 bg-white text-black shadow-lg rounded-md mt-2 w-48 z-10

              >
                <option value="nombre">Categoria</option>
                {/* <option value="categoria">Categoria</option> */}
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

      {/* Boton de adicionar */}
      <div className="fixed bottom-4 right-4">
        <div className="relative">
          <button
            className="text-white p-4 rounded-full shadow-lg transition duration-300 transform hover:scale-110"
            style={{ backgroundColor: "#0FA0CC" }}
            onClick={() => {
              navigate('/categoriasForm');
            }}
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
        
    </nav>
  )
}