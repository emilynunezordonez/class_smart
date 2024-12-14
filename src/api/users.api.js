 import axios from 'axios'


const UserApi = axios.create({
    baseURL: 'https://proyecto-desarrollo.onrender.com',
});


export const getAllUsers = () => UserApi.get("/api/usuarios/",{headers: {
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})




export const registerUser=(user)=>{
    return UserApi.post("/api/usuarios/register/",user, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`
        
        
      }})
}

export const getUser=(id)=>UserApi.get('/api/usuarios/'+id+'/',{headers: {
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const updateUser=(user)=>{
    return UserApi.put("/api/usuarios/update_user/",user,{headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }})
}

export const deleteUser=(id)=> UserApi.delete('/api/usuarios/'+id+'/',{headers: {
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})


export const searchUsers=(searchCriteria,searchValue)=> UserApi.get('/api/usuarios/search_users/?criteria='+searchCriteria+'&'+'value='+searchValue,{headers: {
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }})

export const login=(user)=>UserApi.post('/login/',user)

export const register_user=(user)=>UserApi.post('/register_user/',user)

export const verfify_Email=(token)=>UserApi.get('/verify_email/',{headers: {
  'Authorization': `Token ${token}`
}})
