import React from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
export function BarrasProductosMasVendidos({selectedRows}) {
  

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
              data={selectedRows}
              x="nombre"
              y="total_vendidos"
              style={{
                data: { fill: "#0FA0CC", width: 20 },
              }}
              
            />
          </VictoryChart> 
    </div>
  )
}
