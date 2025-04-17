import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [progressRequests, setProgressRequests] = useState([]);
  const [isActiveToday, setIsActiveToday] = useState(false);
  const [requestLocations, setRequestLocations] = useState([]);

  const getLatLngFromCity = async (city) => {
    if (!city) return null;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`, {
        headers: {
          'User-Agent': 'YourAppName/1.0 (email@example.com)',
        },
      });
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      }
    } catch (error) {
      console.error('Geolocation error:', error);
    }
    return null;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const pendingRes = await fetch('http://localhost:5000/request/pending');
        const pendingData = await pendingRes.json();
        setPendingRequests(pendingData.data);

        const progressRes = await fetch('http://localhost:5000/request/progress');
        const progressData = await progressRes.json();
        const user = localStorage.getItem('user');
        const filteredProgress = progressData.data.filter((req) => req.volunteer === user);
        setProgressRequests(filteredProgress);

        const locations = [];
        for (const request of pendingData.data) {
          if (request.priority === 'high' || request.priority === 'critical') {
            const latLng = await getLatLngFromCity(request.area);
            if (latLng) {
              locations.push({ id: request._id, ...latLng });
            }
          }
        }
        setRequestLocations(locations);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      const user = localStorage.getItem('user');
      const res = await fetch(`http://localhost:5000/request/accept/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });

      const result = await res.json();
      if (res.ok) {
        setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
        setProgressRequests((prev) => [...prev, result.updatedRequest]);
      }
    } catch (error) {
      console.error('Accept error:', error);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:5000/request/complete/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setProgressRequests((prev) => prev.filter((req) => req._id !== requestId));
      }
    } catch (error) {
      console.error('Complete error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    fetch('http://localhost:5000/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto">
        <nav className="bg-white shadow-md rounded-xl px-6 py-4 mb-8 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">Volunteer Dashboard</div>
          <div className="space-x-6">
            <a href="/volunteer/home" className="text-gray-700 hover:text-blue-500">Home</a>
            <a href="/volunteer/requests" className="text-gray-700 hover:text-blue-500">Requests</a>
            <button onClick={handleLogout} className="text-red-500 font-semibold">Logout</button>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Today's Activity</h2>
            <p className={`text-lg font-medium ${isActiveToday ? 'text-green-600' : 'text-red-600'}`}>
              {isActiveToday ? 'You are active today!' : 'You haven’t marked activity today.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Service Requests</h2>
            {pendingRequests.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <li key={request._id} className="py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{request.needType || 'Request'}</p>
                        <p className="text-sm text-gray-500">Location: {request.area || 'N/A'}</p>
                      </div>
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Accept
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No pending requests at the moment.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 mt-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ongoing Requests</h2>
          {progressRequests.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {progressRequests.map((request) => (
                <li key={request._id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{request.needType}</p>
                    <p className="text-sm text-gray-500">Location: {request.area || 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => handleCompleteRequest(request._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Complete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No active requests currently in progress.</p>
          )}
        </div>

        {/* Map Section */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Request Locations</h2>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: '400px', width: '100%' }}
            className="rounded-md"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {requestLocations.map((reqLocation, idx) => (
              <Marker key={idx} position={[reqLocation.lat, reqLocation.lon]}>
                <Popup>
                  <strong>High/Critical Priority Request</strong>
                  <br />
                  {`Request ID: ${reqLocation.id}`}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
