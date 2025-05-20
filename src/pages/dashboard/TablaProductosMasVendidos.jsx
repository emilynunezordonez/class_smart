import React from "react";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { tablaProductosMasVendidos } from "../../api/dashboard.api";

export function TablaProductosMasVendidos({ setSelectedRows }) {
  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTablaProductosMasVendidos() {
      try {
        setLoading(true);
        const res = await tablaProductosMasVendidos();
        setData(res.data);
        setRecords(res.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData([]);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    }
    loadTablaProductosMasVendidos();
  }, []);

  const handleChange = (e) => {
    const filteredRecords = data.filter((record) => {
      return record.nombre.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setRecords(filteredRecords);
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
    },
    {
      name: "Precio",
      selector: (row) => row.precio,
    },
    {
      name: "Estado",
      selector: (row) => (row.estado_producto ? "Activo" : "Inactivo"),
    },
    {
      name: "Cantidad",
      selector: (row) => row.cantidad_producto,
    },
    {
      name: "Total Vendidos",
      selector: (row) => row.total_vendidos,
    },
    {
      name: "Ingresos por U",
      selector: (row) => row.ingresos,
    },
  ];

  if (loading) {
    return (
      <div className="table_container" data-testid="loading">
        Cargando datos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="table_container">
        <div data-testid="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="table_container">
      <input
        type="text"
        className="text-black border border-gray-300 rounded px-2 py-1 mb-4"
        onChange={handleChange}
        data-testid="search-input"
      />
      <DataTable
        title="Productos mas Vendidos"
        columns={columns}
        data={records}
        selectableRows
        pagination
        progressPending={loading}
        progressComponent={<div data-testid="loading">Cargando...</div>}
        noDataComponent={
          <div data-testid="no-data">No hay registros para mostrar</div>
        }
        paginationPerPage={5}
        onSelectedRowsChange={({ selectedRows }) => {
          const formattedRows = selectedRows.map((row) => ({
            nombre: row.nombre,
            total_vendidos: row.total_vendidos,
          }));
          setSelectedRows(formattedRows);
        }}
        fixedHeader
      />
    </div>
  );
}
