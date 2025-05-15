import axios from 'axios';
import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  partialUpdateProduct,
  searchProducts,
  searchUserProducts,
  updateCantidadProductoCarrito,
  insertarCarrito,
  vaciarCarrito,
  createFavorito,
  deleteFavorito,
  getAllFavoritos
} from '../../src/api/products.api';

jest.mock('axios');

describe('Producto API', () => {
  const mockGet = axios.get;
  const mockPost = axios.post;
  const mockPut = axios.put;
  const mockPatch = axios.patch;
  const mockDelete = axios.delete;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('authToken', 'test-token');
  });

  const authHeaderJSON = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token test-token'
    }
  };

  const authHeaderMultipart = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Token test-token'
    }
  };

  it('debería obtener todos los productos', async () => {
    mockGet.mockResolvedValue({ data: ['prod1'] });
    const res = await getAllProducts();
    expect(mockGet).toHaveBeenCalledWith('api/productos/');
    expect(res.data).toEqual(['prod1']);
  });

  it('debería crear un producto', async () => {
    const product = new FormData();
    product.append('nombre', 'Producto A');
    mockPost.mockResolvedValue({ data: 'creado' });
    const res = await createProduct(product);
    expect(mockPost).toHaveBeenCalledWith('api/productos/', product, authHeaderMultipart);
    expect(res.data).toBe('creado');
  });

  it('debería obtener un producto por ID', async () => {
    mockGet.mockResolvedValue({ data: { id: 1 } });
    const res = await getProduct(1);
    expect(mockGet).toHaveBeenCalledWith('api/productos/1/');
    expect(res.data.id).toBe(1);
  });

  it('debería actualizar un producto', async () => {
    const product = new FormData();
    product.append('nombre', 'Actualizado');
    mockPut.mockResolvedValue({ data: 'ok' });
    const res = await updateProduct(1, product);
    expect(mockPut).toHaveBeenCalledWith('api/productos/1/', product, authHeaderMultipart);
    expect(res.data).toBe('ok');
  });

  it('debería eliminar un producto', async () => {
    mockDelete.mockResolvedValue({ status: 204 });
    const res = await deleteProduct(2);
    expect(mockDelete).toHaveBeenCalledWith('api/productos/2/', authHeaderJSON);
    expect(res.status).toBe(204);
  });

  it('debería hacer partial update a un producto', async () => {
    mockPatch.mockResolvedValue({ data: { cantidad_producto: 5 } });
    const res = await partialUpdateProduct(3, 5);
    expect(mockPatch).toHaveBeenCalledWith('api/productos/3/', { cantidad_producto: 5 }, authHeaderJSON);
    expect(res.data.cantidad_producto).toBe(5);
  });

  it('debería buscar productos por criterio y valor', async () => {
    mockGet.mockResolvedValue({ data: ['result1'] });
    const res = await searchProducts('nombre', 'Camisa');
    expect(mockGet).toHaveBeenCalledWith('api/filter_products/?criteria=nombre&value=Camisa');
    expect(res.data[0]).toBe('result1');
  });

  it('debería buscar productos de un usuario', async () => {
    mockGet.mockResolvedValue({ data: ['productoUsuario'] });
    const res = await searchUserProducts(42);
    expect(mockGet).toHaveBeenCalledWith('api/search_users_products/?criteria=usuario_id&value=42');
    expect(res.data[0]).toBe('productoUsuario');
  });

  it('debería actualizar cantidad en el carrito', async () => {
    mockPatch.mockResolvedValue({ data: { cantidad_producto: 3 } });
    const res = await updateCantidadProductoCarrito(7, 3);
    expect(mockPatch).toHaveBeenCalledWith('api/users_products/7/', { cantidad_producto: 3 }, {
      headers: { 'Content-Type': 'application/json' }
    });
    expect(res.data.cantidad_producto).toBe(3);
  });

  it('debería insertar un producto al carrito', async () => {
    const data = { producto_id: 1, usuario_id: 2 };
    mockPost.mockResolvedValue({ data: 'ok' });
    const res = await insertarCarrito(data);
    expect(mockPost).toHaveBeenCalledWith('api/users_products/', data);
    expect(res.data).toBe('ok');
  });

  it('debería vaciar el carrito de un usuario', async () => {
    mockDelete.mockResolvedValue({ status: 200 });
    const res = await vaciarCarrito(5);
    expect(mockDelete).toHaveBeenCalledWith('api/delete_all_userProducts/?user_id=5');
    expect(res.status).toBe(200);
  });

  it('debería crear un favorito', async () => {
    const fav = { usuario_id: 1, producto_id: 2 };
    mockPost.mockResolvedValue({ data: 'favorito' });
    const res = await createFavorito(fav);
    expect(mockPost).toHaveBeenCalledWith('api/favoritos/', fav);
    expect(res.data).toBe('favorito');
  });

  it('debería eliminar un favorito', async () => {
    mockDelete.mockResolvedValue({ status: 204 });
    const res = await deleteFavorito(8);
    expect(mockDelete).toHaveBeenCalledWith('api/favoritos/8/');
    expect(res.status).toBe(204);
  });

  it('debería obtener todos los favoritos', async () => {
    mockGet.mockResolvedValue({ data: ['fav1', 'fav2'] });
    const res = await getAllFavoritos();
    expect(mockGet).toHaveBeenCalledWith('api/favoritos/');
    expect(res.data.length).toBe(2);
  });
});
