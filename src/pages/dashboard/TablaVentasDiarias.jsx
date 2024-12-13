import React from 'react'
import DataTable from "react-data-table-component"
import { useState, useEffect } from 'react'
import {  ventasDiarias } from '../../api/dashboard.api'



export function TableVentasDiarias() {


    const [data, setData] = useState([])

    useEffect(() => {
        async function loadVentasDiarias() {
            const res = await ventasDiarias();
            setData(res.data)
            setRecords(res.data)
        }
        loadVentasDiarias()

    }, [])



    const [records, setRecords] = useState(data)

    

    const handleChange = (e) => {
       const filteredRecords= data.filter(record => {
            return record.fecha.toLowerCase().includes(e.target.value.toLowerCase())

        })

        setRecords(filteredRecords)
    }




    const columns = [
        {
            name: 'Fecha',
            selector: row => row.fecha

        },
        {
            name: "Total Pedidos",
            selector: row => row.total_pedidos

        },
        {

            name: "Total Ventas",
            selector: row => row.total_ventas


        }
        

    ]
    return (
        <div className='table_container'>
            <input type="text" className='text-black border border-gray-300 rounded px-2 py-1 mb-4' onChange={handleChange} />
            <DataTable
            title={'Ventas Diarias'}
                columns={columns}
                data={records}
                pagination
                paginationPerPage={5}
                fixedHeader
            />

        </div>
    )
}
