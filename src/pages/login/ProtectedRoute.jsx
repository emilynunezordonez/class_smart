import { Navigate,Outlet } from "react-router-dom";
import React from 'react';

const ProtectedRoute=()=>{
    const isAutenticated=!!localStorage.getItem('authToken');
    return isAutenticated? <Outlet/>: <Navigate to='/login'/>;

};

export default ProtectedRoute;