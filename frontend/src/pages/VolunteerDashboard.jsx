import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [progressRequests, setProgressRequests] = useState([]);
  const [isActiveToday, setIsActiveToday] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = localStorage.getItem('user');

        const pendingRes = await fetch('http://localhost:5000/request/pending');
        const pendingData = await pendingRes.json();
        setPendingRequests(pendingData.data);

        const progressRes = await fetch('http://localhost:5000/request/progress');
        const progressData = await progressRes.json();
        console.log(progressData)
        const filteredProgress = progressData.data.filter(
          (req) => req.volunteer === user
        );
        setProgressRequests(filteredProgress);
        console.log(filteredProgress)

        // setIsActiveToday(...) // Activity logic if needed
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      const user = localStorage.getItem('user');

      const response = await fetch(`http://localhost:5000/request/accept/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });

      const result = await response.json();
      if (response.ok) {
        setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
        setProgressRequests((prev) => [...prev, result.updatedRequest]);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/request/complete/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setProgressRequests((prev) => prev.filter((req) => req._id !== requestId));
      }
    } catch (error) {
      console.error('Error completing request:', error);
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
            <button
              type="button"
              onClick={handleLogout}
              className="text-red-500 font-semibold"
            >
              Logout
            </button>
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
                        <p className="text-sm text-gray-500">Location: {request.location || 'N/A'}</p>
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

        {/* Progress Requests Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ongoing Requests</h2>
          {progressRequests.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {progressRequests.map((request) => (
                <li key={request._id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{request.needType}</p>
                    <p className="text-sm text-gray-500">Location: {request.location || 'N/A'}</p>
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
      </div>
    </div>
  );
};

export default VolunteerDashboard;
