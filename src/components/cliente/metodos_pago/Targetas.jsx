import React from 'react'
import visa from "../../../images/visa.jpg"
import mastercard from "../../../images/mastercard.jpg"
import dinersclub from "../../../images/dinersclub.png"
import americanexpress from "../../../images/americanexpress.png"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'



import { useState } from 'react'
import { authService } from '../../../services/authService'

export default function Targetas({ userP, formD }) {

  const [opcion, setOpcion] = useState('bancolombia')

  const [isFormularioOpen, setIsFormularioOpen] = useState(false)

  const [errors,setErrors]=useState({})

  const navigate=useNavigate()

  const [formData,setFormData]=useState({
    name:'',
    country:'',
    cardnumber:'',
    expirationdate:'',
    securitycode:''
  })

  const handleOnchange=(e)=>{
  setFormData({...formData, [e.target.name]:e.target.value })
  
  }


  const handleSubmit = (e) => {
    e.preventDefault(e)
 

    
    setIsFormularioOpen(true)
  }

  const handleSubmit2=(e)=>{
    e.preventDefault(e)
    setIsFormularioOpen(false)
    const res=authService.HacerCompra(formD,userP)
    toast.success('Pago exitoso', {
      position: 'bottom-right',
      style: { background: '#101010', color: '#fff' },
    });
    console.log(res.data)
    
    navigate('/client')
    
  }
  return (
    <div className='max-w-xl mx-auto mt-10' >
      <h2 className='text-xl  text-black'>Elige tu Taregeta de Credito</h2>
      <form action="" className='mt-4' onSubmit={handleSubmit}>

        <select className='bg-gray-200 text-black p-3 rounded-lg block w-full mb-3' name="bancos"
          onChange={(e) => setOpcion(e.target.value)}
        >
          <option value="mastercard">Master Card</option>
          <option value="visa">Visa</option>
          <option value="americanexpress">American express</option>
          <option value="dinersclub">Diners Club</option>
        </select>

        <button className='bg-indigo-500 p-3 rounded-lg w-48 hover:bg-green-700 hover:cursor-pointer transition duration-300'>ir a Pagar </button>

      </form>
      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto mt-10">
        <img
          src={visa}
          alt="visa"
          className="w-full h-40 object-contain p-2 border rounded-lg"
        />
        <img
          src={mastercard}
          alt="mastercard"
          className="w-full h-40 object-contain p-2 border rounded-lg"
        />
        <img
          src={dinersclub}
          alt="dinersclub"
          className="w-full h-40 object-contain p-2 border rounded-lg"
        />
        <img
          src={americanexpress}
          alt="americanexpress"
          className="w-full h-40 object-contain p-2 border rounded-lg"
        />

        {isFormularioOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <form className="space-y-4" onSubmit={handleSubmit2}>
              <h2 className="text-lg text-gray-500 font-semibold mt-4" >Personal Information</h2>

              <h1 className="text-sm text-gray-500 font-semibold mt-4">Name</h1>
              <input
                className="w-full h-10 p-2 border text-black rounded-lg "
                type="text"
                name='name'
                value={formData.name}
                onChange={handleOnchange}
                placeholder='Name'
                required
              />

              <h1 className="text-sm text-gray-500 font-semibold mt-4">Coutry</h1>
              <input
                className="w-full h-10 p-2 border rounded-lg text-black"
                type="text"
                name='country'
                value={formData.country}
                placeholder='Country'
                onChange={handleOnchange}
                required
              />

              <h2 className="text-lg text-gray-500 font-semibold mt-4">Payment Information</h2>

              <div className="space-y-3">
                <h4 className="text-sm text-gray-500 font-semibold mt-4">Card Number</h4>
                <input
                  className="w-full h-10 p-2 border rounded-lg text-black"
                  type="text"
                  name="cardnumber"
                  placeholder='1234 1234 1234 1234'
                 value={formData.cardnumber} 
                 onChange={handleOnchange}
                 required
                />

                <div className="flex space-x-3">
                  <div className="w-1/2">
                    <h1 className="text-sm text-gray-500 font-semibold mt-4" >Expiration Date</h1>
                    <input
                      className="w-full h-10 p-2 border rounded-lg text-black"
                      type='date'
                      name="expirationdate"
                      value={formData.expirationdate}
                      onChange={handleOnchange}
                    />
                  </div>
                  <div className="w-1/2">
                    <h1 className="text-sm text-gray-500 font-semibold mt-4">Security Code</h1>
                    <input
                      className="w-full h-10 p-2 border rounded-lg  text-black"
                      type='text'
                      name="securitycode"
                      placeholder='CVC'
                      value={formData.securitycode}
                      onChange={handleOnchange}
                      required
                    />
                  </div>
                </div>

              </div>
              <button
                  
                  className="text-indigo-500 hover:underline"
                  onClick={()=>{
                    const noEmptyFormData= Object.values(formData).every(value=>value==='');
                    
                    if(!noEmptyFormData){
                      window.open("https://www.paypal.com/signin?/myaccount/transfer/state")
                    }
                    
                   

                  }}
                  
                >
                  PayPal
                </button>

              <button
                className='bg-indigo-500 p-3 rounded-lg w-full hover:bg-green-700 hover:cursor-pointer transition duration-300'

              >
                Pagar
              </button >
             
            </form>
            <button className='bg-indigo-500 p-3 rounded-lg w-full hover:bg-green-700 hover:cursor-pointer transition duration-300 mt-4'
                onClick={() => setIsFormularioOpen(false)}
              >
                Cancelar
              </button>
          </div>
        </div>
        )}
      </div>


    </div>
  )
}