import { useNavigate } from "react-router-dom";

export function UserCard({user}) {

    const navigate=useNavigate();

    return (
        <div className="bg-zinc-100 p-3 hover:bg-zinc-200
        hover:cursor-pointer"

        onClick={()=>{
            navigate('/users-create/'+user.id)
        }}
        >
            
            <h1 className="font-bold uppercase text-black">{user.username}</h1>
            <p className="text-slate-600">{user.email}</p>
            {/* <p className="text-slate-400">{product.precio}</p>
            <p className="text-slate-400">{product.descripcion}</p> */}
            
        </div>
    );
}

