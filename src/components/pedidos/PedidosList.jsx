import React, { useEffect, useState } from 'react';
import { getAllPedidos } from '../../api/pedidos.api';
import { PedidoCard } from './PedidoCard';

export function PedidosList() {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await getAllPedidos();
                setPedidos(response.data);
            } catch (error) {
                console.error('Error fetching pedidos:', error);
            }
        };

        fetchPedidos();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-3">
      {pedidos.map(pedido => (
        <PedidoCard key={pedido.id} pedido={pedido} />
      ))}

    </div>
    );
}