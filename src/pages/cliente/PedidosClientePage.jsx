import React, { useEffect, useState } from 'react'

import { searchUserProducts } from '../../api/products.api';

import Bancos from '../../components/cliente/metodos_pago/Bancos'
import Targetas from '../../components/cliente/metodos_pago/Targetas';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

import bancolombia from "../../images/bancolombia.png"
import nequi from "../../images/nequi.png"
import bancoBogota from "../../images/bancoBogota.png"
import davivienda from "../../images/davivienda.jpg"

import visa from "../../images/visa.jpg"
import mastercard from "../../images/mastercard.jpg"
import dinersclub from "../../images/dinersclub.png"
import americanexpress from "../../images/americanexpress.png"
import efecti from "../../images/efecti.jpeg"


export default function PedidosClientePage() {


  const [userProducts, setUserProducts] = useState([]);

  const [Transferencia, setTransferencia] = useState(false)
  const [Targeta, setTargeta] = useState(false)
  const [inicio,setInicio]=useState(true)


  const navigate = useNavigate()


  useEffect(() => {
    async function loadUserProducts() {
      try {
        const res = await searchUserProducts(localStorage.getItem('user_id'))
        setUserProducts(res.data)
      } catch (error) {
      }

    };
    loadUserProducts()

  }, [])


  const [formData, setFormData] = useState({
    direccion: "",
    metodo_pago: "Transferencia bancaria",
    usuarios: parseInt(localStorage.getItem('user_id')),
    estado_pedido: false,



  });

  

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    switch (formData.metodo_pago) {
      case 'Tarjeta de credito': setTargeta(true); setTransferencia(false); setInicio(false)
        break;
      case 'efecty':
        authService.HacerCompra(formData, userProducts);
        setTargeta(false);
        setTransferencia(false);
        setInicio(false);
        window.open('https://www.efectyvirtual.com/PortalEcommerce/Account/Login?Geolocalizacion=%2F%2F'); navigate('/client');
        break;
      default: setTransferencia(true); setTargeta(false); setInicio(false)





    }
  }



  return (
    <div className='max-w-xl mx-auto mt-10'>
      {inicio && (
      <div>
      
      <form  onSubmit={handleSubmit}>
      <h2 className='text-lx font-bold text-black'>Informacion de Pago</h2>

        <input type="text"
          className='bg-gray-200 text-black p-3 rounded-lg block w-full mb-3 mt-3'
          name="direccion"
          placeholder="Direccion"
          value={formData.direccion}
          onChange={handleChange}
          required


        />

        <select type="text"

          className='bg-gray-200 text-black p-3 rounded-lg block w-full mb-3'
          name="metodo_pago"
          value={formData.metodo_pago}
          onChange={handleChange}

        >
          <option value="Transferencia bancaria"> Transferecia Bancaria</option>
          <option value="Tarjeta de credito">Tarjeta de Credito</option>
          <option value="efecty">Efecty</option>


        </select>

        <button
          className='bg-indigo-500 p-3 rounded-lg w-48 hover:bg-green-700 hover:cursor-pointer transition duration-300'
          type='submit'
        >
          Siguiente

        </button>


      </form>

      

      <div className="grid grid-cols-3 gap-0 max-w-xl mx-auto mt-10">
        <img
          src={bancolombia}
          alt="bancolombia"
          className="w-40 h-30 object-contain p-1"
        />
        <img
          src={nequi}
          alt="nequi"
          className="w-40 h-30 object-contain p-1"
        />
        <img
          src={bancoBogota}
          alt="bancoBogota"
          className="w-40 h-30 object-contain p-1"
        />
        <img
          src={davivienda}
          alt="davivienda"
          className="w-40 h-30 object-contain p-1"
        />

        <img
          src={visa}
          alt="visa"
          className="w-40 h-30 object-contain p-1"
        />
        <img
          src={mastercard}
          alt="mastercard"
          className="w-40 h-30 object-contain p-1"
        />
        <img
          src={dinersclub}
          alt="dinersclub"
          className="w-40 h-30 object-contain p-1"
        />
        <img
          src={americanexpress}
          alt="americanexpress"
          className="w-40 h-30 object-contain p-1"
        />
        <img
          src={efecti}
          alt="americanexpress"
          className="w-40 h-30 object-contain p-1"
        />

        
      </div>

      </div>)}
      
      {Transferencia && (<Bancos userP={userProducts} formD={formData} />)}
      {Targeta && (<Targetas userP={userProducts} formD={formData} />)}

    </div>
  )
}
