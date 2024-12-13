import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo/clasSmart.png'; 
import { Navigation } from '../../components/cliente/Navigation'; 

export function Nosotros() {

  const navigate = useNavigate();
  

  const handleBackClick = () => {
    navigate("/client");
  };

  return (
    <div>
      <Navigation />
      <button
              className="flex flex-col p-1 text-black hover:text-gray-900 transition duration-300 flex items-center"
              onClick={handleBackClick}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="ml-2">Back</span>
            </button>
      
      <div className="text-black container mx-auto p-7">
      <div className="flex justify-center mb-4">
        <img src={logo} alt="ClasSmart Logo" className="h-20" />

      </div>
        < h1 className="text-4xl mb-5 font-bold text-center hover:scale-110 transition-transform duration-300 ease-in-out">ClasSmart</h1>

        <h1 className="text-3xl font-bold mb-4">Sobre Nosotros</h1>
        <p className="text-xl mb-4">
          Bienvenido a ClasSmart. Somos una empresa dedicada a ofrecer los mejores productos al mejor precio.
        </p>
        <p className="text-xl mb-4">
          Además de contar con una gran cantidad de productos, también ofrecemos la mejor calidad
        </p>
        <div className="container mx-auto ">
          <p className="mt-10">
            Fui desarrollado por: <br />
            Salomé Acosta Montaño,
            Emily Núñez Ordóñez,
            Andrés David Ortega Arteaga,
            Sheila Marcela Valencia Chito,
            Victoria Andrea Volveras Parra
          </p>
        </div>
      </div>
    </div>
  );
}
