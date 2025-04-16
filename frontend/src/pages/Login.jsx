import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {

  const {
    register,
    handleSubmit, reset,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (form) => {
    console.log(form)
    reset()
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data)
      toast.success('Login successful! Redirecting...', {
        autoClose: 1500,
      });
      localStorage.setItem("id", data._id)
      localStorage.setItem("user", data.name)
      localStorage.setItem("role",data.role)
      console.log(localStorage)
      if(data.role == "user")
        navigate('/user_dashboard')
      else if(data.role == "volunteer")
        navigate('/volunteer_dashboard')
      else{
        navigate('/admin_dashboard')
      }
    } catch (err) {
      toast.error('Invalid credentials. Please try again.');
      console.log(err)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 bg-gradient-to-br from-yellow-100 to-red-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          New user?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
