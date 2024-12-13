import React from 'react'
import bancolombia from "../../../images/bancolombia.png"
import nequi from "../../../images/nequi.png"
import bancoBogota from "../../../images/bancoBogota.png"
import davivienda from "../../../images/davivienda.jpg"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '../../../services/authService'


export default function Bancos({userP,formD}) {

const[opcion,setOpcion]=useState('bancolombia')

const navigate=useNavigate();

const handleSubmit=(e)=>{
 e.preventDefault(e)
  const res=authService.HacerCompra(formD,userP)
  console.log(res)


  switch(opcion){
    case 'nequi': window.open('https://transacciones.nequi.com/bdigital/login.jsp');
    break;
    case 'bancoBogota':window.open('https://virtual.bancodebogota.co/');
    break;
    case'davivienda':window.open('https://www.davivienda.com/wps/portal/personas/nuevo/personas/aqui_puedo/pagar_facilmente/pse/!ut/p/z1/hY5BC4IwHMU_iwePbX83s9ltBR0EixDKdgmVNQXnZFqjb986BkXv9ni_HzwscInFUD06Vc2dGare94tIrpQd4322IXmxSynwHIotTw8RO1F8_gcIP8OPcPC--IdkWHS1Rq7RCFAcRRAvU8JSQlcRSd4P-VBTprCw8iattOhu_fF2nsdpHUIIzjmkjFG9RI3RIXxTWjPNuPwk8ahLWIj66XgQvAAm08Dj/dz/d5/L2dBISEvZ0FBIS9nQSEh/#');
    break;
    default: window.open('https://sucursalpersonas.transaccionesbancolombia.com/mua/USER?scis=YY%2F8m2Cyz9CFiqf4WV6s13R2rT1MnXo5GpPyHFTkRiw%3D#no-back-button');
  }
  navigate('/client')
  
}

  return (
    <div className='max-w-xl mx-auto mt-10'>
      <h2 className='text-xl  text-black'>Elige tu Banco</h2>
      <form action="" className='mt-4' onSubmit={handleSubmit}>
        
      <select className='bg-gray-200 text-black p-3 rounded-lg block w-full mb-3' name="bancos"
      onChange={(e)=>setOpcion(e.target.value)}
      >
          <option value="bancolombia">Bancolombia</option>
          <option value="nequi">Nequi</option>
          <option value="davivienda">Davivienda</option>
          <option value="bancoBogota">Bango de Bogota</option>
        </select>

        <button  className='bg-indigo-500 p-3 rounded-lg w-48 hover:bg-green-700 hover:cursor-pointer transition duration-300'>ir a Pagar </button>

      </form>
      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto mt-10">
      <img 
        src={bancolombia} 
        alt="bancolombia"  
        className="w-full h-40 object-contain p-2 border rounded-lg"
      />
      <img 
        src={nequi} 
        alt="nequi"  
        className="w-full h-40 object-contain p-2 border rounded-lg"
      />
      <img 
        src={bancoBogota} 
        alt="bancoBogota"  
        className="w-full h-40 object-contain p-2 border rounded-lg"
      />
      <img 
        src={davivienda} 
        alt="davivienda"  
        className="w-full h-40 object-contain p-2 border rounded-lg"
      />
    </div>
      
       
    </div>
  )
}
