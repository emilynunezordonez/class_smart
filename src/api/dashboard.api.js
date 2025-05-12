import axios from 'axios'
const dashboardApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});
export const productosMasVendidos=()=>dashboardApi.get('api/productos_mas_vendidos',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const indicadoresUsuario=()=>dashboardApi.get('api/indicadores_por_usuario',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const ventasDiarias=()=>dashboardApi.get('api/ventas_diarias',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const metodosPMasUtilizados=()=>dashboardApi.get('api/metodos_pago_mas_utilizados',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const tablaProductosMasVendidos=()=>dashboardApi.get('api/productosMasVendidos',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const  valorTotalVentas=()=>dashboardApi.get('api/valor_total_ventas',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const  estadosPedidos=()=>dashboardApi.get('api/pedidos_por_estado',{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})