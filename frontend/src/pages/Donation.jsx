import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import axios from 'axios';

const DonatePage = () => {
  const { disasterId } = useParams();
  const [disaster, setDisaster] = useState(null);
  const [upiId, setUpiId] = useState('');

  const upi = localStorage.getItem("upi")
  useEffect(() => {
    const fetchDisasterData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/disaster/upi/${upi}`);
        setDisaster(res.data);
        setUpiId(res.data.upi);
      } catch (err) {
        console.error('Error fetching disaster data:', err);
      }
    };

    fetchDisasterData();
  }, [disasterId]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {disaster ? (
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-3xl font-semibold text-blue-700 mb-6">
              Donate to {disaster.name}
            </h2>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg border shadow">
                <QRCode
                  value={`upi://pay?pa=${upiId}&pn=Your%20Organization`}
                  size={200}
                />
              </div>
            </div>

            {/* Donation Instructions */}
            <p className="text-lg text-gray-700 mb-4">
              Scan the QR code to donate using your UPI app, or use the UPI ID below:
            </p>
            <p className="text-xl font-bold text-green-700 mb-6">
              {upiId}
            </p>

            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition">
              Donate Now
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading disaster data...</p>
        )}
      </div>
    </div>
  );
};

export default DonatePage;
