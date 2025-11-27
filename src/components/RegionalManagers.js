import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RegionalManagers() {
  const branch = localStorage.getItem("branch");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Fetch users using axios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://zerohour-backend.onrender.com/api/v1/user"
        ); // update with your actual API
        const users = response.data.data || [];

        // Filter users with role === "admin"
        const filteredAdmins = users.filter(
          (user) => user.Branch === branch && user.RegionalStatus === "Manager"
        );
        setAdmins(filteredAdmins);
      } catch (err) {
        console.error("Error fetching admins:", err);
        // setError("Failed to load admins.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [branch]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="w-full mx-auto py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Contact Regional Manager
      </h2>

      {admins.length > 0 ? (
        <div className="space-y-6">
          {admins.map((admin, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4">
                <img
                  src={`https://zerohour-backend.onrender.com${admin.image}`} // fallback image
                  alt={`${admin.FirstName} ${admin.LastName}`}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-semibold text-black">
                    {admin.FirstName} {admin.LastName}
                  </h3>
                  <p className="text-md text-gray-600">Regional Officer</p>
                  <p className="text-md text-gray-600">{admin.Phone}</p>
                  <p className="text-md text-gray-600">{admin.Address}</p>
                </div>
              </div>
              <div className="bg-blue-100 px-4 py-2 text-md text-gray-700 text-center">
                {admin.Email}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No regional manager available</p>
      )}
    </div>
  );
}
