import axios from 'axios'
const pedidosApi= axios.create({
    baseURL:'https://proyecto-desarrollo.onrender.com/api/'
})

export const productosMasVendidos=()=>pedidosApi.get('productos_mas_vendidos',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const indicadoresUsuario=()=>pedidosApi.get('indicadores_por_usuario',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const ventasDiarias=()=>pedidosApi.get('ventas_diarias',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const metodosPMasUtilizados=()=>pedidosApi.get('metodos_pago_mas_utilizados',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const tablaProductosMasVendidos=()=>pedidosApi.get('productosMasVendidos',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const  valorTotalVentas=()=>pedidosApi.get('valor_total_ventas',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const  estadosPedidos=()=>pedidosApi.get('pedidos_por_estado',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})