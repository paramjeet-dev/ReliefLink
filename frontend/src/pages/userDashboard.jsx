import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHandsHelping, FaHistory, FaDonate, FaClock } from 'react-icons/fa';
import { MdLogout, MdSettings } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';

// WeatherCard Component
const WeatherCard = ({ onLocationFetched }) => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState({ city: '', country: '' });

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const apiKey = 'e3e70444be1fee44d3c64640f36fbdde';
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        const data = await res.json();
        setWeather({
          temp: data.main.temp,
          condition: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
        const loc = { city: data.name, country: data.sys.country };
        setLocation(loc);
        if (onLocationFetched) onLocationFetched(loc);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => console.error('Geolocation error:', err)
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

// SummaryCard Component
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
    fetch('http://localhost:5000/auth/logout', { method: 'POST' });
    navigate('/');
  };

  const getDonations = async () => {
    const res = await fetch(`http://localhost:5000/user/donations/${id}`);
    const data = await res.json();
    setDonations(data);
    const total = data.reduce((sum, d) => sum + d.amount, 0);
    const recent = data[data.length - 1]?.amount || 0;
    const causes = new Set(data.map((d) => d.cause || 'General'));
    setUserStats({ totalDonated: total, causesSupported: causes.size, recentDonation: recent });
  };

  const getPendingRequests = async () => {
    const res = await fetch(`http://localhost:5000/user/pending_request/${id}`);
    const result = await res.json();
    setPendingRequests(result.data);
  };

  const getDisasters = async () => {
    const res = await fetch('http://localhost:5000/disaster/all');
    const result = await res.json();
    setDisasters(result.data);
  };

  // 🧠 ML + Request Handler
  const onSubmit = async (data) => {
    try {
      const userRes = await fetch(`http://localhost:5000/user/details/${id}`);
      const userInfo = await userRes.json();
      const pincode = userInfo.pincode || '000000';

      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const mlPayload = {
          "Latitude":lat,
          "Longitude":lon,
          "Description": data.description,
          "Pincode": pincode,
          "Location_Type": 'hilly',
          "People_Trapped": data.affected,
        };

        const mlRes = await fetch('http://localhost:5001/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mlPayload),
        });

        const mlData = await mlRes.json();
        console.log(mlData)
        const priority = mlData.priority || 'normal';

        const finalPayload = {
          user: id,
          needType: data.needType,
          description: data.description,
          disasterType: data.disasterType,
          status: 'pending',
          area: location,
          affected: data.affected,
          priority:priority,
        };

        const response = await fetch('http://localhost:5000/request/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalPayload),
        });

        if (!response.ok) throw new Error('Failed to submit request');

        toast.success('Request created with priority!');
        reset();
        setShowModal(false);
        getPendingRequests();
      });
    } catch (err) {
      console.error('Error submitting request:', err);
      toast.error('Submission failed.');
    }
  };

  useEffect(() => {
    getDonations();
    getPendingRequests();
    getDisasters();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Toaster />
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800">Welcome, {name}</h1>
          <div className="flex gap-3">
            <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaHandsHelping /> Create Request
            </button>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <MdLogout /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard label="Total Donated" value={`$${userStats.totalDonated}`} icon={<FaDonate size={24} />} bgColor="bg-purple-500" />
          <SummaryCard label="Causes Supported" value={userStats.causesSupported} icon={<FaHandsHelping size={24} />} bgColor="bg-green-500" />
          <SummaryCard label="Last Donation" value={`$${userStats.recentDonation}`} icon={<FaHistory size={24} />} bgColor="bg-blue-500" />
          <WeatherCard onLocationFetched={setLocation} />
        </div>

        {/* Donations and Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-600">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaHistory className="text-purple-600" /> Donation History
            </h2>
            {donations.length ? (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="py-2 px-4 text-left">Cause</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                    <th className="py-2 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {donations.map((donation) => (
                    <tr key={donation._id}>
                      <td className="py-2 px-4">{donation.cause || 'General'}</td>
                      <td className="py-2 px-4 text-right">${donation.amount}</td>
                      <td className="py-2 px-4 text-right">{new Date(donation.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No donations yet.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaClock className="text-yellow-500" /> Pending Requests
            </h2>
            {pendingRequests.length ? (
              <ul className="divide-y">
                {pendingRequests.map((req) => (
                  <li key={req._id} className="py-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{req.needType}</p>
                        <p className="text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-yellow-600 font-semibold">{req.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No pending requests.</p>
            )}
          </div>
        </div>

        {/* Disaster Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {disasters.length ? (
            disasters.map((d) => (
              <div key={d._id} className="bg-white p-6 rounded-xl shadow-lg text-center">
                <img src={`http://localhost:5000/images/disasters/${d.image}`} alt={d.name} className="w-full h-40 object-cover rounded mb-4" />
                <h3 className="text-lg font-semibold text-blue-600 mb-2">{d.name}</h3>
                <p className="text-gray-600 mb-4">{d.description}</p>
                <button onClick={() => {
                  localStorage.setItem("upi", d.upi);
                  navigate('/donate');
                }} className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600">
                  Donate
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No disasters at the moment.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Create Help Request</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Need Type</label>
                <input {...register('needType', { required: true })} className="w-full p-2 border rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea {...register('description', { required: true })} className="w-full p-2 border rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Disaster Type</label>
                <select {...register('disasterType', { required: true })} className="w-full p-2 border rounded-md">
                  <option value="">Select</option>
                  <option value="Flood">Flood</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Fire">Fire</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Average affected people</label>
                <input type="number" {...register('affected', { required: true })} className="w-full p-2 border rounded-md" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
