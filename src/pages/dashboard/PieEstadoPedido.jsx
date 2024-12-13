import React, { useEffect, useState } from 'react'
import { VictoryPie, VictoryTheme } from 'victory'
import { estadosPedidos } from '../../api/dashboard.api'

export default function PieEstadoPedido() {
    const [data, setData] = useState([])

    useEffect(() => {


        async function loadEstadosPedidos() {
            const res = await estadosPedidos ();
            setData(res.data)
            
        }
        loadEstadosPedidos()

    }, [])
    

    const dataPie = data.length === 2 
  ? [
      { x: 'Entregado', y: data[1]['total_pedidos'] },
      { x: "En proceso", y: data[0]['total_pedidos'] }
    ]
  : data.length === 1
    ? [{ x: data[0]['usuarios__username']? 'Entregado':'En Proceso', y: data[0]['total_pedidos'] }]
    : [];

    return (
        <div>
            <VictoryPie
                data={dataPie}
                theme={VictoryTheme.clean}
            />

        </div>
    )
}
