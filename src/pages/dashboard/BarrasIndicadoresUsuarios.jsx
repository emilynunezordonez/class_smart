import React from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
export function BarrasIndicadoresUsuarios({selectedRowsIndicadores}) {

  return (
    <div>
        <VictoryChart theme={VictoryTheme.material} domainPadding={20} >
            {/* Eje X */}
            <VictoryAxis
              style={{
                axis: { stroke: "#756f6a" },
                ticks: { stroke: "#756f6a" },
                tickLabels: { fontSize: 12, padding: 5 },
              }}
            />
            {/* Eje Y */}
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: "#756f6a" },
                grid: { stroke: "gray", strokeDasharray: "4, 4" },
                tickLabels: { fontSize: 12, padding: 5 },
              }}
            />
            {/* Gráfico de barras */}
            <VictoryBar
              data={selectedRowsIndicadores}
              x="nombre"
              y="total_pedidos"
              style={{
                data: { fill: "#0FA0CC", width: 20 },
              }}
              
            />
          </VictoryChart> 
    </div>
  )
}