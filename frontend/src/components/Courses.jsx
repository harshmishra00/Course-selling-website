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

function Courses() {
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("user");


  useEffect(() => {
    if (token) setIsLoggedIn(true);

    const fetchCourses = async () => {
      try {
        const config = {
          withCredentials: true
        };
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }

        const response = await axios.get(`${BACKEND_URL}/course/courses`, config);

        console.log("Fetched courses:", response.data.courses);
        setCourses(response.data.courses || []);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage("Failed to fetch courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);


  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/user/logout`, { withCredentials: true });
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      toast.success("Logged out successfully");
      navigate("/login");
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
              <span className="flex items-center text-blue-500">
                <FaDiscourse className="mr-2" /> Courses
              </span>
            </li>
            <li className="mb-4">
              <Link to="/purchases" className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
              </Link>
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
        <h2 className="page-title text-2xl font-semibold mb-4">All Courses</h2>


        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {loading ? (
          <div className="text-center">Loading courses...</div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col justify-between"
              >
                <img
                  className="rounded-lg w-full h-48 object-"
                  src={course.image?.url || "https://via.placeholder.com/200"}
                  alt={course.title}
                />

                <div className="mt-4">

                  <h3 className="text-lg font-semibold">{course.title}</h3>


                  <p className="text-sm text-gray-600 line-clamp-2">
                    {course.description || "No description available"}
                  </p>


                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl font-bold text-green-600">
                      ₹{course.price}
                    </span>
                    <span className="text-sm line-through text-gray-400">
                      ₹{(course.price * 1.3).toFixed(0)}
                    </span>
                    <span className="text-sm text-red-500 font-semibold">
                      30% off
                    </span>
                  </div>


                  <Link to={`/buy/${course._id}`}>
                    <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      Buy Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No courses available.</p>
        )}
      </div>
    </div>
  );
}

export default Courses;
