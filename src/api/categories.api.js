import axios from 'axios'
const categoriaApi= axios.create({
    baseURL:'http://localhost:8000/api/categorias/'
})

export const getAllCategories = () => categoriaApi.get("/")

export const getCategoria = (id) => categoriaApi.get(id+"/")

export const updateCategoria = (id, categoria) => {
    return categoriaApi.put("/" + id + "/", categoria, {
        headers: {
            'Content-Type': 'application/json', // or 'multipart/form-data' if you're sending files
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
    });
}

export const deleteCategoria = (id) => {
    return categoriaApi.delete("/" + id + "/", {
        headers: {
            'Content-Type': 'application/json', // or 'multipart/form-data' if you're sending files
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
    });
}

export const createCategoria = (categoria) => {
    return categoriaApi.post("/", categoria, {
        headers: {
            'Content-Type': 'application/json', // or 'multipart/form-data' if you're sending files
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
    });
}