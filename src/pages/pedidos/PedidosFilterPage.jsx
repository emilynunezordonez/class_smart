import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllPedidos } from "../../api/pedidos.api";
import { PedidosList } from "../../components/pedidos/PedidosList";
import { PedidoCard } from "../../components/pedidos/PedidoCard";
import { Navigation } from "../../components/pedidos/Navigation";

export function PedidosFilterPage() {
  const { estado } = useParams();
  const [pedidos, setPedidos] = useState([]);
  console.log("estado:", estado);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const response = await getAllPedidos();
        if (estado === "1") {
          const filteredPedidos = response.data.filter(
            (pedido) => pedido.estado_pedido === true
          );
          setPedidos(filteredPedidos);
        } else {
          const filteredPedidos = response.data.filter(
            (pedido) => pedido.estado_pedido === false
          );
          setPedidos(filteredPedidos);
        }
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        setPedidos([]); // Opcional: asegurar que no quede nada renderizado
      }
    }
    fetchPedidos();
  }, []);

  return (
    <div>
      <Navigation />
      <div className="container mx-auto mt-4 grid grid-cols-1 gap-4">
        {pedidos.map((pedido) => (
          <PedidoCard key={pedido.id} pedido={pedido} />
        ))}
      </div>
    </div>
  );
}
