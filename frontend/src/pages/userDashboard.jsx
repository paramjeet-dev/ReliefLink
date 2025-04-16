import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHandsHelping, FaHistory, FaDonate, FaClock } from 'react-icons/fa';
import { MdLogout, MdSettings } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';

const WeatherCard = ({ onLocationFetched }) => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState({ city: '', country: '' });

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const apiKey = 'e3e70444be1fee44d3c64640f36fbdde';
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        const weatherData = await weatherRes.json();

        const weatherInfo = {
          temp: weatherData.main.temp,
          condition: weatherData.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
        };

        const loc = {
          city: weatherData.name,
          country: weatherData.sys.country,
        };

        setWeather(weatherInfo);
        setLocation(loc);

        if (onLocationFetched) {
          onLocationFetched(loc);
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
        }
      );
    }
  }, [onLocationFetched]);

  return (
    <div className="bg-blue-100 text-gray-800 p-4 rounded-xl shadow-md flex items-center justify-between">
      {weather ? (
        <>
          <div>
            <p className="text-sm text-blue-600 font-medium">
              Weather in {location.city}, {location.country}
            </p>
            <h3 className="text-xl font-bold">{weather.temp}°C</h3>
            <p className="capitalize text-gray-700">{weather.condition}</p>
          </div>
          <img src={weather.icon} alt="weather icon" className="w-12 h-12" />
        </>
      ) : (
        <p>Fetching weather...</p>
      )}
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('user');
  const id = localStorage.getItem('id');

  const [donations, setDonations] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userStats, setUserStats] = useState({
    totalDonated: 0,
    causesSupported: 0,
    recentDonation: 0,
  });

  const [disasters, setDisasters] = useState([]);
  const [location, setLocation] = useState({ city: '', country: '' });

  const { register, handleSubmit, reset } = useForm();

  const handleLogout = () => {
    localStorage.clear();
    fetch('http://localhost:5000/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    navigate('/');
  };

  const handleSettings = () => {
    console.log('Go to settings');
  };

  const getDonations = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user/donations/${id}`);
      const data = await response.json();
      setDonations(data);

      const totalDonated = data.reduce((sum, d) => sum + d.amount, 0);
      const recentDonation = data.length > 0 ? data[data.length - 1].amount : 0;
      const causes = new Set(data.map((d) => d.cause || 'General'));

      setUserStats({
        totalDonated,
        causesSupported: causes.size,
        recentDonation,
      });
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const getPendingRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user/pending_request/${id}`);
      const result = await response.json();
      setPendingRequests(result.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleDonation = async (upi) => {
    localStorage.setItem("upi", upi);
    navigate('/donate');
  };

  const getDisasters = async () => {
    try {
      const response = await fetch('http://localhost:5000/disaster/all');
      const result = await response.json();
      setDisasters(result.data);
    } catch (error) {
      console.error('Error fetching disasters:', error);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      user: id,
      needType: data.needType,
      description: data.description,
      disasterType: data.disasterType,
      status: 'pending',
      area: location
    };

    try {
      const response = await fetch('http://localhost:5000/request/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create request');
      }

      await response.json();
      toast.success('Help request submitted successfully!');
      reset();
      setShowModal(false);
      getPendingRequests();
    } catch (error) {
      console.error('Error creating help request:', error);
      toast.error('Failed to submit help request.');
    }
  };

  useEffect(() => {
    getDonations();
    getPendingRequests();
    getDisasters();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Toaster position="top-right" />
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800">Welcome, {name}</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <FaHandsHelping /> Create Request
            </button>
            <button
              onClick={handleSettings}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <MdSettings /> Settings
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <MdLogout /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            label="Total Donated"
            value={`$${userStats.totalDonated}`}
            icon={<FaDonate size={24} />}
            bgColor="bg-purple-500"
          />
          <SummaryCard
            label="Causes Supported"
            value={userStats.causesSupported}
            icon={<FaHandsHelping size={24} />}
            bgColor="bg-green-500"
          />
          <SummaryCard
            label="Last Donation"
            value={`$${userStats.recentDonation}`}
            icon={<FaHistory size={24} />}
            bgColor="bg-blue-500"
          />
          <WeatherCard onLocationFetched={setLocation} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donation History */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-600">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaHistory className="text-purple-600" /> Donation History
            </h2>
            {donations.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="py-2 px-4 text-left">Cause</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                    <th className="py-2 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation._id}>
                      <td className="py-2 px-4">{donation.cause || 'General'}</td>
                      <td className="py-2 px-4 text-right">${donation.amount}</td>
                      <td className="py-2 px-4 text-right">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 italic">No recent donations made.</p>
            )}
          </div>

          {/* Pending Requests */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaClock className="text-yellow-500" /> Pending Requests
            </h2>
            {pendingRequests.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {pendingRequests.map((req) => (
                  <li key={req._id} className="py-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{req.needType || 'Request'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm text-yellow-600 font-semibold">
                        {req.status || 'Pending'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">You have no pending requests at this time.</p>
            )}
          </div>
        </div>

        {/* Disasters Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {disasters.length > 0 ? (
            disasters.map((disaster) => (
              <div key={disaster._id} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
                <img
                  src={`http://localhost:5000/images/disasters/${disaster.image}`}
                  alt={disaster.name}
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-blue-600 mb-2">{disaster.name}</h3>
                <p className="text-gray-600 mb-4">{disaster.description}</p>
                <button
                  onClick={() => handleDonation(disaster.upi)}
                  className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600"
                >
                  Donate
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No disasters found at the moment.</p>
          )}
        </div>
      </div>

      {/* Help Request Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Create Help Request</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Need Type</label>
                <input
                  {...register('needType', { required: true })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter need type"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register('description', { required: true })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter description"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Disaster Type</label>
                <select
                  {...register('disasterType', { required: true })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Disaster Type</option>
                  <option value="Flood">Flood</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Fire">Fire</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, icon, bgColor }) => (
  <div className={`${bgColor} text-white p-4 rounded-xl shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/70">{label}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className="bg-white/20 p-3 rounded-full">{icon}</div>
    </div>
  </div>
);

export default UserDashboard;
