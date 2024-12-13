import { useForm } from 'react-hook-form';
import { createProduct, getProduct, updateProduct, deleteProduct } from '../../api/products.api';
import { getAllCategories } from '../../api/categories.api';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


export function ProductFormPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const [showModal, setShowModal] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await getAllCategories();
      const categorias = response.data;
      const cat = categorias.find((categoria) => categoria.nombre_categoria === data.categoria);

      if (cat !== undefined) {
        const newdata = {
          nombre: data.nombre,
          precio: data.precio,
          descripcion: data.descripcion,
          cantidad_producto: parseInt(data.cantidad_producto),
          estado_producto: data.estado_producto === 'true',
          categoria: cat.id,
          foto_producto: data.foto_producto[0],
        };

        if (params.id) {
          await updateProduct(params.id, newdata);
          toast.success('Producto actualizado correctamente', {
            position: 'bottom-right',
            style: { background: '#101010', color: '#fff' },
          });
        } else {
          await createProduct(newdata);
          toast.success('Producto creado exitosamente', {
            position: 'bottom-right',
            style: { background: '#101010', color: '#fff' },
          });
        }
        navigate('/products');
        
      } else {
        toast.error('Categoría no encontrada', {
          position: 'bottom-right',
          style: { background: '#101010', color: '#fff' },
        });
      }
    } catch (error) {
      toast.error('Ocurrió un error', {
        position: 'bottom-right',
        style: { background: '#101010', color: '#fff' },
      });
    }
  });


    const handleBackClick = () => {
    navigate('/products');
  };


  

  useEffect(() => {
    async function loadProduct() {
      if (params.id) {
        const res = await getProduct(params.id);
        const response = await getAllCategories();
        const categorias = response.data;
        const cat = categorias.find((categoria) => categoria.id === res.data.categoria);

        setValue('nombre', res.data.nombre);
        setValue('precio', res.data.precio);
        setValue('descripcion', res.data.descripcion);
        setValue('cantidad_producto', String(res.data.cantidad_producto));
        setValue('categoria', cat.nombre_categoria);
        setValue('estado_producto', String(res.data.estado_producto));
      

      }
    }
    loadProduct();
  }, [params.id, setValue]);

  return (
    <div className="max-w-xl mx-auto mt-10">
      {/* Contenedor para la flecha */}
        <button
          className="absolute top-0 left-0 p-3 text-gray-600 hover:text-gray-900 transition duration-300 flex items-center"
          onClick={handleBackClick}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-2">Back</span>
        </button>

      {/* Formulario */}
      <form onSubmit={onSubmit} className="mt-10">
        <input
          className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
          type="text"
          name="nombre"
          placeholder="Nombre"
          {...register('nombre', { required: true })}
        />
        <input
          className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
          type="number"
          name="precio"
          placeholder="Precio"
          {...register('precio', { required: true })}
        />
        <textarea
          className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
          name="descripcion"
          placeholder="Descripción"
          {...register('descripcion', { required: true })}
        />
        <input
          className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
          type="number"
          name="cantidad_producto"
          placeholder="Cantidad de producto disponible"
          {...register('cantidad_producto', { required: true })}
        />
        <select
          className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
          name="estado_producto"
          {...register('estado_producto', { required: true })}
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
        <input
          className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
          type="text"
          name="categoria"
          placeholder="Categoría"
          {...register('categoria', { required: true })}
        />
        <input
          className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
          type="file"
          name="foto_producto"
          {...register('foto_producto')}
        />

        <div className="flex gap-4 mt-3">
          <button
            className="bg-indigo-500 p-3 rounded-lg flex-1 hover:bg-indigo-700 transition duration-300"
            type="submit"
          >
            Save
          </button>
         
        </div>
      </form>
      <div className="flex gap-4 mt-3">

      {params.id && (
            <button
              className="bg-red-500 p-3 rounded-lg flex-1 hover:bg-red-700 transition duration-300"
              onClick={async () => {
                const accepted = window.confirm('¿Estás seguro de querer borrar este producto?');
                if (accepted) {
                  try {
                    await deleteProduct(params.id);
                    toast.success('Producto eliminado exitosamente', {
                      position: 'bottom-right',
                      style: { background: '#101010', color: '#fff' },
                    });
                    navigate('/products');
                  } catch (error) {
                    toast.error('No tiene permiso para realizar esta acción', {
                      position: 'bottom-right',
                      style: { background: '#101010', color: '#fff' },
                    });
                  }
                }
              }}
            >
              Delete
            </button>
          )}

      </div>
      
    </div>
  );
}