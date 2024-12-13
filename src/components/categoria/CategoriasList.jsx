import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../../api/categories.api';
import { CategoriaCard } from './CategoriaCard';

export function CategoriasList() {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await getAllCategories();
                setCategorias(response.data);
            } catch (error) {
                console.error('Error fetching pedidos:', error);
            }
        };

        fetchCategorias();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-3">
      {categorias.map(categoria => (
        <CategoriaCard key={categoria.id} categoria={categoria} />
      ))}

    </div>
    );
}