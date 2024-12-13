import React from 'react';
import { Navigation } from '../../components/categoria/Navigation';
import { useParams } from 'react-router-dom';
import { CategoriasList } from '../../components/categoria/CategoriasList';


export function CategoriaPage() {
    return (
  
      <div>
        <Navigation />
        <div className='container mx-auto mt-4 text-black'> <CategoriasList />  </div>
      </div>
    )
  }