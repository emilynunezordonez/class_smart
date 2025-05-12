import axios from 'axios'
const productoApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const getAllProducts = () => productoApi.get("api/productos/")


export const createProduct=(product)=>{
    return productoApi.post("api/productos/",product,{
        headers: { 'Content-Type': 'multipart/form-data','Authorization': `Token ${localStorage.getItem('authToken')}` },
      })
}

export const getProduct=(id)=>productoApi.get('api/productos/'+id+'/')

export const updateProduct=(id,product)=> {
    return productoApi.put("api/productos/"+id+"/",product,{
        headers: { 'Content-Type': 'multipart/form-data','Authorization': `Token ${localStorage.getItem('authToken')}`},
      })
}

export const deleteProduct=(id)=> productoApi.delete('api/productos/'+id+'/',{headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${localStorage.getItem('authToken')}`
    
    
  }})

export const partialUpdateProduct=(id,cantidad_producto)=> productoApi.patch('api/productos/'+id+'/',{cantidad_producto},{headers: {
  'Content-Type': 'application/json',
  'Authorization': `Token ${localStorage.getItem('authToken')}`
  
  
}})



export const searchProducts=(searchCriteria,searchValue)=> productoApi.get('api/filter_products/?criteria='+searchCriteria+'&'+'value='+searchValue)
       
export const searchUserProducts=(searchValue)=>productoApi.get('api/search_users_products/?criteria=usuario_id&value='+searchValue)

export const updateCantidadProductoCarrito=(id,cantidad_producto)=>productoApi.patch('api/users_products/'+id+'/',{cantidad_producto},{
  headers: { 'Content-Type': 'application/json' }
})

export const insertarCarrito=(data)=>productoApi.post('api/users_products/',data)

export const vaciarCarrito=(id)=>productoApi.delete('api/delete_all_userProducts/?user_id='+id)

export const createFavorito=(data)=>productoApi.post('api/favoritos/',data)

export const deleteFavorito=(id)=>productoApi.delete('api/favoritos/'+id+'/')

export const getAllFavoritos=()=>productoApi.get('api/favoritos/')