import axios from 'axios';
import {
  getAllCategories,
  getCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from '../../src/api/categories.api';

jest.mock('axios');

describe('Categoría API requests', () => {
  const mockGet = axios.get;
  const mockPost = axios.post;
  const mockPut = axios.put;
  const mockDelete = axios.delete;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('authToken', 'test-token');
  });

  it('debería obtener todas las categorías', async () => {
    mockGet.mockResolvedValue({ data: ['cat1', 'cat2'] });
    const response = await getAllCategories();
    expect(mockGet).toHaveBeenCalledWith('api/categorias/');
    expect(response.data).toEqual(['cat1', 'cat2']);
  });

  it('debería obtener una categoría por id', async () => {
    mockGet.mockResolvedValue({ data: { id: 1, name: 'cat1' } });
    const response = await getCategoria(1);
    expect(mockGet).toHaveBeenCalledWith('api/categorias/1/');
    expect(response.data.id).toBe(1);
  });

  it('debería crear una categoría', async () => {
    const categoria = { name: 'nueva' };
    mockPost.mockResolvedValue({ data: { id: 3, ...categoria } });

    const response = await createCategoria(categoria);

    expect(mockPost).toHaveBeenCalledWith(
      'api/categorias/',
      categoria,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Token test-token'
        })
      })
    );
    expect(response.data.name).toBe('nueva');
  });

  it('debería actualizar una categoría', async () => {
    const categoria = { name: 'actualizada' };
    mockPut.mockResolvedValue({ data: { id: 4, ...categoria } });

    const response = await updateCategoria(4, categoria);

    expect(mockPut).toHaveBeenCalledWith(
      'api/categorias/4/',
      categoria,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Token test-token'
        })
      })
    );
    expect(response.data.id).toBe(4);
  });

  it('debería eliminar una categoría', async () => {
    mockDelete.mockResolvedValue({ data: { success: true } });

    const response = await deleteCategoria(5);

    expect(mockDelete).toHaveBeenCalledWith(
      'api/categorias/5/',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Token test-token'
        })
      })
    );
    expect(response.data.success).toBe(true);
  });
});
