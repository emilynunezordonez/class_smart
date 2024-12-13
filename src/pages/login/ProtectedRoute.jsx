import { Navigate,Outlet } from "react-router-dom";

const ProtectedRoute=()=>{
    const isAutenticated=!!localStorage.getItem('authToken');
    return isAutenticated? <Outlet/>: <Navigate to='/login'/>;

};

export default ProtectedRoute;