import axios from 'axios'
const productoApi= axios.create({
    baseURL:'https://proyecto-desarrollo.onrender.com/api/'
})

export const getAllProducts = () => productoApi.get("productos/")


export const createProduct=(product)=>{
    return productoApi.post("/productos/",product,{
        headers: { 'Content-Type': 'multipart/form-data','Authorization': `Token ${localStorage.getItem('authToken')}` },
      })
}

export const getProduct=(id)=>productoApi.get('/productos/'+id+'/')

export const updateProduct=(id,product)=> {
    return productoApi.put("/productos/"+id+"/",product,{
        headers: { 'Content-Type': 'multipart/form-data','Authorization': `Token ${localStorage.getItem('authToken')}`},
      })
}

export const deleteProduct=(id)=> productoApi.delete('/productos/'+id+'/',{headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${localStorage.getItem('authToken')}`
    
    
  }})

export const partialUpdateProduct=(id,cantidad_producto)=> productoApi.patch('/productos/'+id+'/',{cantidad_producto},{headers: {
  'Content-Type': 'application/json',
  'Authorization': `Token ${localStorage.getItem('authToken')}`
  
  
}})



export const searchProducts=(searchCriteria,searchValue)=> productoApi.get('/filter_products/?criteria='+searchCriteria+'&'+'value='+searchValue)
       
export const searchUserProducts=(searchValue)=>productoApi.get('/search_users_products/?criteria=usuario_id&value='+searchValue)

export const updateCantidadProductoCarrito=(id,cantidad_producto)=>productoApi.patch('/users_products/'+id+'/',{cantidad_producto},{
  headers: { 'Content-Type': 'application/json' }
})

export const insertarCarrito=(data)=>productoApi.post('/users_products/',data)

export const vaciarCarrito=(id)=>productoApi.delete('/delete_all_userProducts/?user_id='+id)

export const createFavorito=(data)=>productoApi.post('/favoritos/',data)

export const deleteFavorito=(id)=>productoApi.delete('/favoritos/'+id+'/')

export const getAllFavoritos=()=>productoApi.get('/favoritos/')