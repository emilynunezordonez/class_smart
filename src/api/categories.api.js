import axios from 'axios'
const categoriaApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const getAllCategories = () => categoriaApi.get("api/categorias/")

export const getCategoria = (id) => categoriaApi.get("api/categorias/"+id+"/")

export const updateCategoria = (id, categoria) => {
    return categoriaApi.put("api/categorias/" + id + "/", categoria, {
        headers: {
            'Content-Type': 'application/json', // or 'multipart/form-data' if you're sending files
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
    });
}

export const deleteCategoria = (id) => {
    return categoriaApi.delete("api/categorias/" + id + "/", {
        headers: {
            'Content-Type': 'application/json', // or 'multipart/form-data' if you're sending files
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
    });
}

export const createCategoria = (categoria) => {
    return categoriaApi.post("api/categorias/", categoria, {
        headers: {
            'Content-Type': 'application/json', // or 'multipart/form-data' if you're sending files
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
    });
}