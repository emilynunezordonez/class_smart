import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export function CategoriaCard({categoria}) {
    
        const navigate=useNavigate();
        
        return (
            <div className="bg-gray-200 p-3 hover:bg-gray-300 transition duration-300 ease-in-out
        hover:cursor-pointer"
            onClick={()=>{
                navigate('/categoriasForm/'+categoria.id)
            }}

            >
                <div className="flex justify-center items-center">
                    <h1 className="font-bold uppercase"><strong>{categoria.nombre_categoria}</strong></h1>
                </div>
                
            </div>
        );
    }