import React from 'react'
import DataTable from "react-data-table-component"
import { useState, useEffect } from 'react'
import { tablaProductosMasVendidos } from '../../api/dashboard.api'



export function TablaProductosMasVendidos({ setSelectedRows }) {


    const [data, setData] = useState([])

    useEffect(() => {
        async function loadTablaProductosMasVendidos() {
            const res = await tablaProductosMasVendidos();
            setData(res.data)
            setRecords(res.data)
            
        }
        loadTablaProductosMasVendidos()

    }, [])

    

    const [records, setRecords] = useState(data)

    

    const handleChange = (e) => {
        const filteredRecords = data.filter(record => {
            return record.nombre.toLowerCase().includes(e.target.value.toLowerCase())

        })

        setRecords(filteredRecords)
    }



    const columns = [
        {
            name: 'Nombre',
            selector: row => row.nombre

        },
        {
            name: "Precio",
            selector: row => row.precio

        },

        {

            name: "Estado",
            selector: row => row.estado_producto ? "Activo" : "Inactivo"


        },
        {

            name: "Cantidad",
            selector: row => row.cantidad_producto

        },
        {

            name: "Total Vendidos",
            selector: row => row.total_vendidos

        },

        {

            name: "Ingresos por U",
            selector: row => row.ingresos

        },



    ]
    return (
        <div className='table_container'>
            <input type="text" className='text-black border border-gray-300 rounded px-2 py-1 mb-4' onChange={handleChange} />
            <DataTable
            
                title={'Productos mas Vendidos'}
                columns={columns}
                data={records}
                selectableRows
                pagination
                paginationPerPage={5}
                onSelectedRowsChange={rows => {
                    const selectedrows=rows.selectedRows.map(row => {

                        const json = {

                            'nombre': row.nombre,
                            'total_vendidos': row.total_vendidos
                        }
                        return json
                    })
                    setSelectedRows(selectedrows)


                }}
                fixedHeader
            />

        </div>
    )
}