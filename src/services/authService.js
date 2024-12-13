import { register_user ,verfify_Email} from '../api/users.api';
import { createPedido, llenarPedidosProductos, generarFacturaPedido } from '../api/pedidos.api';
import { vaciarCarrito } from '../api/products.api';



export const authService = {
  async register(username, email, password,captcha) {
    try {
        const newdata={
            captcha:captcha,
            user:{
            username:username,
            email:email,
            password:password,
            is_staff:false,
            is_superuser:false
          }

        
        }
      const response= await register_user(newdata)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async verifyEmail(token) {
    try {
      const response = await verfify_Email(token);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },  

async HacerCompra(formData,userProducts) {
  let lista;
  let pedido;

   try {
     const res_pedido= await createPedido(formData)

     lista=userProducts.map((product)=>{
       return {
         cantidad_producto_carrito:product.cantidad_user_producto,
         pedido_ppid:res_pedido.data.id,
         producto_ppid:product.id
 
       } 
     })
     
     pedido= res_pedido
     console.log('Esta es la lista : ',lista)

   } catch (error) {
     console.log('error al crear Pedido',error)
   }

   try {
     const res2=await llenarPedidosProductos(lista)
     console.log('esto es lo que retorna llenar tabla',res2.data)
   } catch (error) {
     console.error('error la llenarPedidosProduct',error)
   }

  const res= vaciarCarrito(localStorage.getItem('user_id'))
  console.log(res)

  try {
       
     const factura = await generarFacturaPedido(pedido.data.id);
     console.log('Factura generada:', factura.data.mensaje); 
   } catch (error) {
     console.error('Error al generar la factura:', error);
   }
  }

}