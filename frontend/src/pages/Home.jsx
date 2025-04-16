import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Use Link for routing
import { FaHandsHelping, FaDonate } from 'react-icons/fa';

const Home = () => {
    const [disasters, setDisasters] = useState([]);

    useEffect(() => {
        // Fetch all disasters from the backend
        fetch('http://localhost:5000/disaster/all')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched disasters:', data); // Debug log to see the response format

                // Ensure we are getting an array and set the data to state
                if (Array.isArray(data.data)) {
                    setDisasters(data.data); // Accessing the 'data' property where the disasters are stored
                } else {
                    console.error('Invalid disaster data format');
                }
            })
            .catch(error => console.error('Error fetching disasters:', error));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="container mx-auto">
                {/* Navbar with Login and Signup Buttons */}
                <div className="flex justify-between items-center mb-8">
                    <div className="text-2xl font-bold text-blue-800">
                        ReliefLink
                    </div>
                    <div>
                        <Link to="/login" className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 mr-4">
                            Login
                        </Link>
                        <Link to="/signup" className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600">
                            Sign Up
                        </Link>
                    </div>
                </div>

                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to ReliefLink</h1>
                    <p className="text-lg text-gray-700">
                        ReliefLink connects people affected by disasters with volunteers and resources. Whether you need assistance or want to help others, our platform makes it easy to coordinate relief efforts.
                    </p>
                </div>

                {/* Action Cards (Request Help, Volunteer, Donate) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
                        <FaHandsHelping className="text-blue-500 text-4xl mb-4" />
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">Request Help</h3>
                        <p className="text-gray-600 mb-4">
                            Need assistance during a disaster? Request food, shelter, medical aid, or evacuation.
                        </p>
                        <Link to="/login" className="text-blue-500 font-medium hover:underline">
                            Get help →
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
                        <FaHandsHelping className="text-green-500 text-4xl mb-4" />
                        <h3 className="text-lg font-semibold text-green-600 mb-2">Volunteer</h3>
                        <p className="text-gray-600 mb-4">
                            Make a difference by offering your time and skills to people affected by disasters.
                        </p>
                        <Link to="/signup" className="text-green-500 font-medium hover:underline">
                            Join as volunteer →
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
                        <FaDonate className="text-yellow-500 text-4xl mb-4" />
                        <h3 className="text-lg font-semibold text-yellow-600 mb-2">Donate</h3>
                        <p className="text-gray-600 mb-4">
                            Support relief efforts with financial contributions to help communities recover.
                        </p>
                        <Link to="/login" className="text-yellow-500 font-medium hover:underline">
                            Donate now →
                        </Link>
                    </div>
                </div>

                {/* Disaster Cards Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Recent Disasters</h2>
                    <div className="flex overflow-x-scroll space-x-6">
                        {disasters.length > 0 ? (
                            disasters.map((disaster) => (
                                <div key={disaster._id} className="bg-white rounded-lg shadow-lg p-6 w-60 flex-shrink-0">
                                    <img
                                        src= "/assets/demo.jpg"// Sample image for disaster
                                        alt={disaster.name}
                                        className="w-full h-40 object-cover rounded-t-lg mb-4"
                                    />
                                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{disaster.name}</h3>
                                    <p className="text-gray-600 mb-4">{disaster.description}</p>
                                    
                                    {/* Donate Button for each disaster */}
                                    <Link to="/login" className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600">
                                        Donate
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">No disasters found at the moment.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;
