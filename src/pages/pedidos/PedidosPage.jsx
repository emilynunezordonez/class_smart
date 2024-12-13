import React from 'react';
import { Navigation } from '../../components/pedidos/Navigation';
import { PedidosList } from '../../components/pedidos/PedidosList'


export function PedidosPage() {
    return (
        <div>
            <Navigation />
            <div className='container mx-auto mt-4'> <PedidosList /> </div>
        </div>
    );
}