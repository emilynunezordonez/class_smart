import React, { useEffect, useState } from 'react';
import { getAllFavoritos, getAllProducts } from '../../api/products.api';
import { authService } from '../../services/authService';
import { Navigation } from '../../components/cliente/Navigation';
import { ClientCard } from '../../components/cliente/ClientCard';



export function ClientFavorites () {
    const [favorites, setFavorites] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const userid = parseInt(localStorage.getItem('user_id'))
                const response = await getAllFavoritos();
                const filteredFavorites = response.data.filter(favorite => favorite.usuario === userid);
                setFavorites(filteredFavorites);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, []);

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await getAllProducts();
                const filteredProducts = res.data.filter(product => favorites.map(favorite => favorite.producto).includes(product.id));
                setProducts(filteredProducts);
            } catch (error) {
                console.log('error al cargar los productos del usuario en PedidosClientePage', error)
            }

        }
        loadProducts();
    }
    , [favorites]);

    return (
        <div>
            <Navigation />
            <div className="grid grid-cols-3 gap-3">
      {products.map(product => (
        <ClientCard key={product.id} product={product} />
      ))}

            </div>

        </div>
    );
};