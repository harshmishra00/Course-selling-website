import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { BACKEND_URL } from "../../utils.js";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("user");

  useEffect(() => {
    if (!token) {
      navigate("/purchases");
    } else {
      setIsLoggedIn(true);
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPurchases(response.data.purchased || []);
      } catch (error) {
        console.error("Fetch error:", error.response || error);

        if (error.response?.status === 403) {
          setErrorMessage("Session expired. Please login again.");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          setErrorMessage("Failed to fetch purchases.");
        }
      }
    };

    fetchPurchases();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/user/logout`, { withCredentials: true });
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response || error);
      toast.error(error.response?.data?.errors || "Error logging out");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen">
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <span className="flex items-center text-blue-500">
                <FaDownload className="mr-2" /> Purchases
              </span>
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>


      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>


      <div
        className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"
          } md:ml-64`}
      >
        <h2 className="page-title text-2xl font-semibold mb-4">My Purchases</h2>


        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}


        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((purchase) => (
              <div
                key={purchase._id}
                className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col justify-between "
              >
                <img
                  className="rounded-lg w-full h-48 object-fill"
                  src={purchase.courseId?.image?.url || "https://via.placeholder.com/200"}
                  alt={purchase.courseId?.title}
                />

                <div className="mt-4">

                  <h3 className="text-lg font-semibold">{purchase.courseId?.title}</h3>


                  <p className="text-sm text-gray-600 line-clamp-2">
                    {purchase.courseId?.description || "No description available"}
                  </p>


                  <Link to={`/course/${purchase.courseId?._id}`}>
                    <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      Dive in..
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no purchases yet.</p>
        )}
      </div>
    </div>
  );
}

export default Purchases;
