import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast'
import { useNavigate} from "react-router-dom"
import { authService } from '../../services/authService';
import ReCAPTCHA from "react-google-recaptcha";
import logo from '../../assets/logo/clasSmart.png'
export function Register() {

    const navigate=useNavigate()

    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        

    });

    const captcha = useRef(null)




   

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (formData.password != formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden', {

                position: "top-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            })
            return;
        }

        if (!captcha.current || !captcha.current.getValue()) {
            toast.error('Por favor, verifica que no eres un robot.', {
                position: "top-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            });
            return;
        }

        try {

            await authService.register(
                formData.username,
                formData.email,
                formData.password,
                captcha.current.getValue()

            );

            
            

        } catch (err) {
            toast.error(err, {

                position: "top-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            })
            
        }

        toast.success('Registro exitoso', {

            position: "top-right",
            style: {
                background: "#101010",
                color: "#fff"
            }
        })

        navigate('/client')
    };

    return (
        <div className='max-w-xl mx-auto mt-10' >
                  <div className="text-center mb-4">
                    <img src={logo} alt="Logo" className="h-20 mx-auto" />
                  </div>
            <h1 className="text-center text-3xl font-bold text-gray-800">Sign Up</h1>

            <div className='text-xl '>Registro de Usuario</div>

            <form onSubmit={handleSubmit}>
                <input
                    className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <input
                    className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                {/* CAPTCHA  */}
                <div className="mb-3">
                    <ReCAPTCHA
                        ref={captcha}
                        sitekey="6Ldch5QqAAAAAJWAlfhVj8E7LFxqh4ezcB40DTqJ"
                    />
                </div>

                {/* Botón Registrarse centrado */}
                <button
                    className='bg-[#0FA0CC] p-3 rounded-lg w-full hover:bg-[#0c88ad] hover:cursor-pointer transition duration-300'
                    type="submit"
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
}