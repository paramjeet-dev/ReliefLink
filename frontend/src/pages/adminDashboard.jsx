import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaChartBar } from "react-icons/fa";

const AdminDashboard = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetch("http://localhost:5000/user/")
      .then((res) => res.json())
      .then((json) => {
        const users = json.data || json;
        const filtered = users.filter((u) => u.role === "volunteer");
        setVolunteers(filtered);
      })
      .catch((err) => console.error("Volunteer fetch error:", err));

    fetch("http://localhost:5000/request/pending")
      .then((res) => res.json())
      .then((json) => {
        const data = json.data || json;
        setPendingRequests(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Pending requests fetch error:", err));

    fetch("http://localhost:5000/request/all")
      .then((res) => res.json())
      .then((json) => {
        const data = json.data || json;
        const completed = data.filter((req) => req.status === "completed");
        setCompletedRequests(completed);
      })
      .catch((err) => console.error("Completed requests fetch error:", err));

    fetch("http://localhost:5000/expense/")
      .then((res) => res.json())
      .then((json) => {
        const data = json.data || json;
        setExpenses(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Expenses fetch error:", err));
  }, []);

  const onSubmit = (data) => {
    fetch("http://localhost:5000/disaster/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Funding request created!");
        setShowModal(false);
        reset();
      })
      .catch((err) => {
        console.error("Error creating funding:", err);
        toast.error("Failed to create funding request.");
      });
  };

  const handleExpenseSubmit = (expenseData) => {
    const userId = localStorage.getItem("userId");
    const fullData = { ...expenseData, user: userId };

    fetch("http://localhost:5000/expense/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullData),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Expense added!");
        setShowExpenseModal(false);
        reset();
      })
      .catch((err) => {
        console.error("Expense creation error:", err);
        toast.error("Failed to add expense.");
      });
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleAlertAllUsers = () => {
    Notification.requestPermission().then((permission) =>{
      if (permission === "granted")
        new Notification("demo")
    })
    
    // fetch("http://localhost:5000/user/alert", {
    //   method: "POST",
    // })
    //   .then((res) => res.json())
    //   .then(() => toast.success("Alert sent to all users!"))
    //   .catch((err) => {
    //     console.error("Alert send error:", err);
    //     toast.error("Failed to send alert.");
    //   });
  };

  // Calculate total expense
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Create Funding Request
          </button>
          <button
            onClick={() => navigate("/manage_users")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Manage Users
          </button>
          <button
            onClick={handleAlertAllUsers}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            Alert All Users
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Add Expense
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Total Requests</h2>
            <p className="text-3xl font-bold text-blue-600">
              {pendingRequests.length + completedRequests.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Pending</h2>
            <p className="text-3xl font-bold text-yellow-600">
              {pendingRequests.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Completed</h2>
            <p className="text-3xl font-bold text-green-600">
              {completedRequests.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Total Expenses</h2>
            <p className="text-3xl font-bold text-purple-600">
              ₹{totalExpenses}
            </p>
          </div>
        </div>

        {/* Expense Summary with Where the Money Was Spent */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaChartBar className="text-green-600" /> Donation Usage
          </h2>
          {expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{expense.category}</span>
                  <span>₹{expense.amount} ({((expense.amount / totalExpenses) * 100).toFixed(2)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      index === 0 ? 'bg-blue-600' :
                      index === 1 ? 'bg-green-600' :
                      index === 2 ? 'bg-yellow-600' :
                      index === 3 ? 'bg-purple-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${(expense.amount / totalExpenses) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No expenses recorded.</p>
          )}
        </div>

        {/* Volunteers */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-2xl font-semibold mb-4">
            Volunteers ({volunteers.length})
          </h2>
          <ul className="space-y-2">
            {volunteers.map((vol) => (
              <li key={vol._id} className="border-b py-1">
                {vol.name} - {vol.email}
              </li>
            ))}
          </ul>
        </div>

        {/* Requests Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Requests */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-2xl font-semibold mb-4">Pending Requests</h2>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests.</p>
            ) : (
              <ul className="space-y-2">
                {pendingRequests.map((req) => (
                  <li key={req._id} className="border-b py-1">
                    {req.title || "Untitled"} — {req.needType || "General"}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Completed Requests */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-2xl font-semibold mb-4">Completed Requests</h2>
            {completedRequests.length === 0 ? (
              <p className="text-gray-500">No completed requests.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {completedRequests.map((req) => (
                  <div key={req._id} className="border-b pb-2">
                    <p className="font-medium">{req.needType || "Untitled"}</p>
                    <p className="text-sm text-gray-600">
                      Completed by: {req.volunteer || "Unknown"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Creating Funding Request */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg relative">
            <h2 className="text-xl font-semibold mb-4">Create Funding Request</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full border p-2 rounded"
                {...register("name", { required: true })}
              />
              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded"
                {...register("description", { required: true })}
              />
              <input
                type="number"
                placeholder="Affected People"
                className="w-full border p-2 rounded"
                {...register("affectedPeople", { required: true })}
              />
              <input
                type="text"
                placeholder="UPI ID"
                className="w-full border p-2 rounded"
                {...register("upiId", { required: true })}
              />
              <input
                type="number"
                placeholder="Donation Aim"
                className="w-full border p-2 rounded"
                {...register("donationAim", { required: true })}
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Adding Expense */}
      {showExpenseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg relative">
            <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
            <form
              onSubmit={handleSubmit(handleExpenseSubmit)}
              className="space-y-4"
            >
              <input
                type="number"
                placeholder="Amount"
                className="w-full border p-2 rounded"
                {...register("amount", { required: true })}
              />
              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded"
                {...register("description")}
              />
              <input
                type="text"
                placeholder="Category (e.g., Food, Travel)"
                className="w-full border p-2 rounded"
                {...register("type")}
              />
              <input
                placeholder="Recepient"
                className="w-full border p-2 rounded"
                {...register("receipient")}
                />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowExpenseModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
