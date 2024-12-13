import React, { useEffect } from "react";

import { indicadoresUsuario, productosMasVendidos, valorTotalVentas } from "../../api/dashboard.api";
import { useState } from "react";
import { TableIndicadoresUsuario } from "./TableIndicadoresUsuario";
import { TableVentasDiarias } from "./TablaVentasDiarias";
import PiePago from "./PiePago";
import { BarrasProductosMasVendidos } from "./BarrasProductosMasVendidos";
import { BarrasIndicadoresUsuarios } from "./BarrasIndicadoresUsuarios"

import { TablaProductosMasVendidos } from "./TablaProductosMasVendidos";
import LineasVentasDiarias from "./LineasVentasDiarias";
import PieEstadoPedido from "./PieEstadoPedido";



export default function Dashboard() {


  const [selectedRows, setSelectedRows] = useState([])
  const [selectedRowsIndicadores, setSelectedRowsIndicadores] = useState([])
  const [data, setData] = useState([])
  const [total_ventas, setTotalVentas] = useState(0)


  useEffect(() => {
    async function loadProductosMasVendidos() {
      const res = await productosMasVendidos();
      const res2 = await valorTotalVentas();
      const res3 = await indicadoresUsuario();
      setData(res.data)
      setSelectedRows(res.data)
      setTotalVentas(res2.data.total_ventas)

      //procesar datos indicadores

      const newIndicadores = res3.data.length != 0 ? res3.data.map(json => (
        {
          'nombre': json.usuarios__username,
          'total_pedidos': json.total_pedidos

        })) : []

      setSelectedRowsIndicadores(newIndicadores)


    }
    loadProductosMasVendidos();

  }, [])





  return (
    <div className="container mx-auto px-4">

      <div className="container mx-auto px-4 py-5" >


        <h2 className="text-5xl font-bold mb-8 text-customBlue" >Dash Board</h2>

        <div className="grid grid-cosl-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* PRODUCTOS MAS VENDIDOS */}

          <div className="bg-gray-200  shadow-md rounded px-4 py-6">
            <TablaProductosMasVendidos setSelectedRows={setSelectedRows} />
          </div>
          {/* INDICADORES USUARIO */}
          <div className="bg-gray-200  shadow-md rounded px-4 py-6">

            <TableIndicadoresUsuario setSelectedRowsIndicadores={setSelectedRowsIndicadores} />


          </div>
          {/* VENTAS DIARIAS */}

          <div className="bg-gray-200  shadow-md rounded px-4 py-6">
            <TableVentasDiarias />
          </div>



          <div className="shadow-md bg-gray-200   rounded px-4 py-6">
            <h2 className="text-xl font-bold mb-2 text-gray-500">Productos Mas Vendidos</h2>

            <BarrasProductosMasVendidos selectedRows={selectedRows} />

          </div>

          <div className="shadow-md rounded px-4 bg-gray-200  py-6">
            <h2 className="text-xl font-bold mb-2 text-gray-500">Cantidad Ventas por Usuario</h2>

            <BarrasIndicadoresUsuarios selectedRowsIndicadores={selectedRowsIndicadores} />

          </div>

          {/* GRAFICA DE LINEAS DE VENTAS DIARIAS */}

          <div className="bg-gray-200  shadow-md rounded px-4 py-6">
            <h2 className="text-xl font-bold mb-2 text-gray-500">Ventas Diarias en Pesos</h2>

            <LineasVentasDiarias />

          </div>

          {/* PIE METODOS PAGO MAS UTILIZADOS */}

          <div className="bg-gray-200  shadow-md rounded px-4 py-6">
            <h2 className="text-xl font-bold mb-2 text-gray-500">Metodos de Pago Mas Usados</h2>

            <PiePago />

          </div>

          {/* PIE METODOS PAGO MAS UTILIZADOS */}

          <div className="bg-gray-200  shadow-md rounded px-4 py-6">
            <h2 className="text-xl font-bold mb-2 text-gray-500">Estado Pedidos</h2>

            <PieEstadoPedido />

          </div>

          <div className="text-center text-2xl text-gray-500 font-bold bg-gray-200 shadow-md rounded px-4 py-6">
            <span>Total Ingresos:</span>
            <div className="flex justify-center items-center mt-4">
              <div className="text-white rounded-full w-32 h-32 flex justify-center items-center text-xl" style={{ backgroundColor: "#0FA0CC" }}>
                {total_ventas}$
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};


