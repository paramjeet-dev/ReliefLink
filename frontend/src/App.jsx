import { useState } from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserDashboard from './pages/userDashboard'
import VolunteerDashboard from './pages/volunteerDashboard'
import AdminDashboard from './pages/adminDashboard'
import Home from './pages/Home'
import Donation from './pages/Donation'
import ManageUsers from './pages/manageUsers'

function App() {
  const router = createBrowserRouter([
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/signup',
      element:<Signup/>
    },
    {
      path:'/user_dashboard',
      element:<UserDashboard/>
    },
    {
      path:'/volunteer_dashboard',
      element:<VolunteerDashboard/>
    },
    {
      path:'/admin_dashboard',
      element:<AdminDashboard/>
    },
    {
      path:'/donate',
      element:<Donation/>
    },
    {
      path:'/manage_users',
      element:<ManageUsers/>
    }
  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
