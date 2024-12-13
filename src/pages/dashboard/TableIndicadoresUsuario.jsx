import React from 'react'
import DataTable from "react-data-table-component"
import { useState, useEffect } from 'react'
import { indicadoresUsuario } from '../../api/dashboard.api'



export function TableIndicadoresUsuario({setSelectedRowsIndicadores}) {


    const [data, setData] = useState([])

    useEffect(() => {
        async function loadIndicadoreUsuario() {
            const res = await indicadoresUsuario();
            setData(res.data)
            setRecords(res.data)
            
        }
        loadIndicadoreUsuario()

    }, [])

    

    const [records, setRecords] = useState(data)

    

    const handleChange = (e) => {
       const filteredRecords= data.filter(record => {
            return record.usuarios__username.toLowerCase().includes(e.target.value.toLowerCase())

        })

        setRecords(filteredRecords)
    }



    const columns = [
        {
            name: 'Nombre',
            selector: row => row.usuarios__username

        },
        {
            name: "Total Vendidos",
            selector: row => row.total_productos_vendidos

        },
        {

            name: "Total Pedidos",
            selector: row => row.total_pedidos


        },
        {

            name: "Ingresos por Usuario",
            selector: row => row.ingresos_por_usuario

        }

    ]
    return (
        <div className='table_container'>
            <input type="text" className='text-black border border-gray-300 rounded px-2 py-1 mb-4' onChange={handleChange} />
            <DataTable
            title={'Indicadores Usuario'}
                columns={columns}
                data={records}
                selectableRows
                pagination
                paginationPerPage={5}
                
                fixedHeader
                onSelectedRowsChange={rows => {
                    const selectedrows=rows.selectedRows.map(row => {

                        const json = {

                            'nombre': row.usuarios__username,
                            'total_pedidos': row.total_pedidos
                        }
                        return json
                    })
                    setSelectedRowsIndicadores(selectedrows)


                }}
            />

        </div>
    )
}
