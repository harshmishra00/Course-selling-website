import React from "react";
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Courses from "./components/Courses";
import Buy from "./components/Buy";
import Purchases from "./components/Purchases";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CourseCreate from "./admin/CourseCreate";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";



function App() {

  const admin = localStorage.getItem("admin");
  const user = localStorage.getItem("user");

  return (<div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/courses" element={<Courses />} />
      <Route path="/buy/:courseId" element={<Buy />} />
      <Route path="/purchases" element={user ? <Purchases /> : < Navigate to={"/login"} />} />

      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={admin ? <Dashboard /> : <Navigate to={"/admin/login"} />} />
      <Route path="/admin/create-course" element={<CourseCreate />} />
      <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
      <Route path="/admin/ourCourses" element={<OurCourses />} />




    </Routes>
    <Toaster />
  </div>
  )
}

export default App;