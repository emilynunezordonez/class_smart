import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../../api/categories.api';
import { CategoriaCard } from './CategoriaCard';
import { useNavigate } from "react-router-dom";

export function CategoriasListFilter({nombre}) {
    const [categorias, setCategorias] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await getAllCategories();
                const filterCategories = response.data.filter(categoria => categoria.nombre_categoria === nombre);
                setCategorias(filterCategories);
                console.log(categorias)
                console.log('nombreEs:' + nombre)
            } catch (error) {
                console.error('Error fetching pedidos:', error);
            }
        };

        fetchCategorias();
    }, []);

    return (
        <div>
            <div className="grid grid-cols-3 gap-3">
            {categorias.map(categoria => (
                <CategoriaCard key={categoria.id} categoria={categoria} />
            ))}
            </div>
            <button 
                onClick={()=>{
                    navigate('/categorias/')
                }}
                className="bg-customBlue p-3 w-48 font-bold rounded-lg mt-7 ml-2"
            >
                Volver
            </button>

        </div>
    );
}