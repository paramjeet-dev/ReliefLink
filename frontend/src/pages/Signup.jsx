import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaUserPlus } from 'react-icons/fa';

const Signup = () => {
  const {
    register,
    handleSubmit, reset,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);
    reset();
    try {
      const res = await axios.post('http://localhost:5000/auth/register', data);
      console.log(res);
      if (res.data.message) {
        toast.success('Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-red-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border-l-4 border-red-500">
        <div className="flex items-center gap-3 mb-6">
          <FaUserPlus className="text-red-500" size={24} />
          <h2 className="text-2xl font-semibold text-gray-800">Create an Account</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Enter a valid 10-digit phone number',
                }
              })}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Pin</label>
            <input
              type="number"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 ${errors.pin ? 'border-red-500' : 'border-gray-300'}`}
              {...register('pin', { required: 'Pin Code is required' })}
            />
            {errors.pin && <p className="text-red-500 text-sm mt-1">{errors.pin.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Role</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400"
              {...register('role')}
              defaultValue="user"
            >
              <option value="user">User</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
