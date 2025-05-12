import axios from 'axios'
const pedidosApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const getAllPedidos = () => pedidosApi.get("api/pedidos/",{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const getAllPedidosProductos = () => pedidosApi.get("api/pedidos_productos/",{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const getPedido = (id) => pedidosApi.get("api/pedidos/"+id+"/",{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`

  }})

export const getPedidoProducto = (id) => pedidosApi.get("api/pedidos_productos/"+id+"/",{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const updatePedido = (id, pedido) => {
    return pedidosApi.put("api/pedidos/" + id + "/", pedido, {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
    });
}

export const send_cancel_mail=(dest,mensaje)=> pedidosApi.get('api/send_email_cancel/?dest='+dest+'&'+'mensaje='+mensaje)

export const deletePedido = (id) => {
    return pedidosApi.delete("api/pedidos/" + id + "/", {
        headers: {
            'Content-Type': 'application/json', // or 'multipart/form-data' if you're sending files
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
    });
}
export const createPedido=(pedido)=>pedidosApi.post('api/pedidos/',pedido,{headers: {
'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const createPedidosProductos=(pedidos_productos)=>pedidosApi.post('api/pedidos_productos/',pedidos_productos,{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const llenarPedidosProductos=(listaPP)=>pedidosApi.post('api/llenarTablaProductosPedidos',listaPP,{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

  export const generarFacturaPedido = (id) => pedidosApi.get('api/generar_factura/?pedido_id='+id,{headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})




