import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getUser } from '../../api/users.api';
import { PedidoProductoCard } from './PedidoProductoCard';

export function PedidoCard({pedido}) {
    
        const navigate=useNavigate();
        const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUser(pedido.usuarios);
                setUsuario(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [pedido.usuarios]);
    
        return (
            <div className="bg-gray-100 text-black p-3 hover:bg-gray-300 
            hover:cursor-pointer rounded-lg transition duration-300"

            onClick={()=>{
                navigate('/pedidosProductos/'+pedido.id+'/'+pedido.usuarios)
            }}

            >
                <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold uppercase text-black"><strong>Pedido #</strong>{pedido.id}</h1>
                    <p className="text-slate-700"><strong>Cliente: </strong>{usuario ? usuario.username : 'Cargando...'}</p>
                    <p className="text-slate-700"><strong>Método de pago: </strong>{pedido.metodo_pago}</p>
                    <p className="text-slate-700"><strong>Fecha: </strong>{pedido.fecha}</p>
                    <p className="text-slate-700"><strong>Hora: </strong>{pedido.hora}</p>
                    <p className="text-slate-700"><strong>Direccion: </strong>{pedido.direccion}</p>

                </div>
                <div>
                <p
                    className={`font-bold uppercase ${
                        pedido.estado_pedido ? 'text-green-600' : 'text-red-600'
                    }`}
                    >
                    {pedido.estado_pedido ? 'ENTREGADO' : 'PENDIENTE'}
                </p>
                </div>
            </div>
                
            </div>
        );
    }