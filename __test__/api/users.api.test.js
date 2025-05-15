jest.mock('axios'); 

import {
  getAllUsers,
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  searchUsers,
  login,
  register_user,
  verfify_Email,
} from '../../src/api/users.api';

import axios from 'axios';

const authHeader = {
  headers: {
    Authorization: 'Token test-token',
  },
};

const authHeaderJSON = {
  headers: {
    Authorization: 'Token test-token',
    'Content-Type': 'application/json',
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.setItem('authToken', 'test-token');
});

describe('User API', () => {
  it('debería obtener todos los usuarios', async () => {
    axios.get.mockResolvedValue({ data: ['user1', 'user2'] });
    const res = await getAllUsers();
    expect(axios.get).toHaveBeenCalledWith('/api/usuarios/', authHeader);
    expect(res.data.length).toBe(2);
  });

  it('debería registrar un usuario', async () => {
    const newUser = { name: 'John' };
    axios.post.mockResolvedValue({ data: newUser });
    const res = await registerUser(newUser);
    expect(axios.post).toHaveBeenCalledWith('/api/usuarios/', newUser, authHeaderJSON);
    expect(res.data.name).toBe('John');
  });

  it('debería obtener un usuario por ID', async () => {
    axios.get.mockResolvedValue({ data: { id: 1 } });
    const res = await getUser(1);
    expect(axios.get).toHaveBeenCalledWith('/api/usuarios/1/', authHeader);
    expect(res.data.id).toBe(1);
  });

  it('debería actualizar un usuario', async () => {
    const user = { id: 1, name: 'Updated' };
    axios.put.mockResolvedValue({ data: user });
    const res = await updateUser(user);
    expect(axios.put).toHaveBeenCalledWith('/api/usuarios/update_user/', user, authHeader);
    expect(res.data.name).toBe('Updated');
  });

  it('debería eliminar un usuario', async () => {
    axios.delete.mockResolvedValue({ status: 204 });
    const res = await deleteUser(5);
    expect(axios.delete).toHaveBeenCalledWith('/api/usuarios/5/', authHeader);
    expect(res.status).toBe(204);
  });

  it('debería buscar usuarios por criterio', async () => {
    axios.get.mockResolvedValue({ data: ['match'] });
    const res = await searchUsers('email', 'test@example.com');
    expect(axios.get).toHaveBeenCalledWith(
      '/api/usuarios/search_users/?criteria=email&value=test@example.com',
      authHeader
    );
    expect(res.data[0]).toBe('match');
  });

  it('debería loguear un usuario', async () => {
    const user = { username: 'admin', password: '123' };
    axios.post.mockResolvedValue({ data: { token: 'abc123' } });
    const res = await login(user);
    expect(axios.post).toHaveBeenCalledWith('/login/', user);
    expect(res.data.token).toBe('abc123');
  });

  it('debería registrar un usuario público', async () => {
    const user = { username: 'guest' };
    axios.post.mockResolvedValue({ data: user });
    const res = await register_user(user);
    expect(axios.post).toHaveBeenCalledWith('/register_user/', user);
    expect(res.data.username).toBe('guest');
  });

  it('debería verificar correo electrónico con token', async () => {
    axios.get.mockResolvedValue({ status: 200 });
    const res = await verfify_Email('token123');
    expect(axios.get).toHaveBeenCalledWith('/verify_email/', {
      headers: {
        Authorization: 'Token token123',
      },
    });
    expect(res.status).toBe(200);
  });
});
