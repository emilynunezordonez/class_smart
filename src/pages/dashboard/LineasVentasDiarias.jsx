import React from 'react'
import {  VictoryLine, VictoryScatter, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
import _ from "lodash";
import { ventasDiarias } from '../../api/dashboard.api'
import { useEffect, useState } from 'react';

export default function LineasVentasDiarias() {
  const [dataRaw, setDataRaw] = useState([])

  useEffect(() => {
    async function loadVentasDiarias() {
      const res = await ventasDiarias();
      
      setDataRaw(res.data)
    }
    loadVentasDiarias()
  }, [])

 

  const processedData = dataRaw.map(item => ({
    x: item.fecha, 
    y: item.total_ventas
  })).sort((a, b) => new Date(a.x) - new Date(b.x));


  const symbols = [
    "circle",
    "diamond",
    "plus",
    "square",
    "triangleUp",
  ];

  return (
    <div>
      <VictoryChart
        theme={VictoryTheme.clean}
      >
        <VictoryAxis
          // tickValues={dataRaw.length>=0 ? dataRaw.map(item=>item.fecha):[]}
          tickFormat={(date) => {
            
            const parsedDate = new Date(date);
            return parsedDate.toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: '2-digit' 
            });
          }}
          scale="time"
          style={{
            tickLabels: {
              fontSize: 8,
            },
            ticks: {
              stroke: "#757575",
              size: 5,
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          // tickValues={dataRaw.length>=0 ?dataRaw.map(item=>item.total_ventas).sort():[]}

          tickFormat={(value) =>
            value
          }
          style={{
            axis: {
              stroke: "transparent",
            },
            axisLabel: {
              fontSize: 8,
              padding: 50,
            },
            tickLabels: {
              fontSize: 8,
            },
            grid: {
              stroke: "#d9d9d9",
              size: 5,
            },
          }}
        />

        <VictoryLine
        data={processedData}
          style={{
            data: {
              stroke:
               "#0FA0CC"
            },
          }}
        />
        <VictoryScatter
        data={processedData}
          size={5}
          style={{
            data: {
              fill: "#0FA0CC"
            },
          }}

        />
        
        
      </VictoryChart>

    </div>
  )
}
