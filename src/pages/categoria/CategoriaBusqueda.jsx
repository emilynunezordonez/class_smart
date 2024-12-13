import React from 'react';
import { Navigation } from '../../components/categoria/Navigation';
import { useParams } from 'react-router-dom';
import { CategoriasListFilter } from '../../components/categoria/CategoriasListFilter';


export function CategoriaBusqueda() {
    const {nombre} = useParams();
    return (

        <div>
        <Navigation />
        <div className='container mx-auto mt-4 text-black'><CategoriasListFilter nombre={nombre} /></div>
        </div>
    )
  }