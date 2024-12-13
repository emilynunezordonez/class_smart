import { useForm } from 'react-hook-form'
import { login } from '../../api/users.api'
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"
import logo from '../../assets/logo/clasSmart.png'






export function LoginFormPage() {
  const navigate = useNavigate();



  const { register, handleSubmit, formState: { errors }, setValue } = useForm();


  const onSubmit = handleSubmit(async data => {
    try {

      const res = await login(data)
    console.log(res.data.token)
    if (res.data.token) {
      localStorage.setItem('authToken', res.data.token);
      console.log(localStorage.getItem('authToken'))
      localStorage.setItem('user_id', res.data.user.id)
      toast.success('Inicio de sesión exitoso', {

        position: "top-right",
        style: {
            background: "#101010",
            color: "#fff"
        }
    });

      if (res.data.user.is_staff) {
        navigate('/products')
      }

      else {
        navigate('/client')
      }


    }
      
    } catch (error) {
      alert('Datos incorrectos o el usuario no existe')
    }
    

  });



  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="text-center mb-4">
        <img src={logo} alt="Logo" className="h-20 mx-auto" />
      </div>

      <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">Log In</h1>

      <form onSubmit={onSubmit}>
        <input
          className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
          type="text"
          name="username"
          placeholder="Username"
          {...register("username", { required: true })}
        />

        <input
          className="bg-gray-200 text-black p-3 rounded-lg block w-full mb-3"
          type="password"
          name="password"
          placeholder="Password"
          {...register("password", { required: true })}
        />

        <div className="flex justify-between items-center mt-3 space-x-200">
          <button
              className="bg-[#0FA0CC] p-3 rounded-lg w-full hover:bg-[#0c88ad] transition duration-300 mr-3"

            type="submit"
          >
            LogIn
          </button>
          <div className="w-full text-center m-100" style={{ marginTop: "1.725rem" }}>
            <button
              className="bg-[#0FA0CC] p-3 rounded-lg w-full hover:bg-[#0c88ad] transition duration-300"
              type="button"
              onClick={() => navigate("/register-user")}
            >
              Sign Up
            </button>
            <p className="text-sm text-gray-600 mt-2 text-center">
              ¿No tienes cuenta?{" "}
              <span
                className="text-[#0FA0CC] font-bold cursor-pointer"
                onClick={() => navigate("/register-user")}
              >
                Regístrate
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );

}