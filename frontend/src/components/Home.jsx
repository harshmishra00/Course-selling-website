import React, { useEffect, useState } from 'react'
import './Home.css'
import { FaFacebook, FaInstagram } from "react-icons/fa";
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Courses from './Courses';

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('user');
    setIsLoggedIn(!!token);
  }, []);


  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/user/logout",
        { withCredentials: true }
      );

      toast.success(response.data.message || "Logged out successfully");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Error in logging out:", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };




  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/v1/course/courses',
          { withCredentials: true }
        );
        setCourses(response.data.courses);
      } catch (error) {
        console.log('Error in fetching courses', error);
      }
    };
    fetchCourses();
  }, []);


  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          infinite: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        }
      }
    ]
  };

  return (
    <div>
      <div>
        <header>
          <div className="logo">
            <h1>BrainLitix</h1>
          </div>
          <div className="button">
            {isLoggedIn ? (
              <button className="btnn" onClick={handleLogout}>Logout</button>

            ) : (
              <>
                <Link to="/signup">Signup</Link>
                <Link to="/login">Login</Link>
              </>
            )}
          </div>
        </header>

        <section className="sec1">
          <h1>
            Train <span className="sp">Brain</span> with Analytics
          </h1>
          <p>
            Get specialized courses particularly designed <br />
            for you by our experts..
          </p>
          <Link to={"/courses"} className="btn">Explore Courses</Link>
        </section>

        <section>
          <Slider className="Slider" {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                  <div className="clr">
                    <img className="img" src={course.image?.url} alt={course.title} />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-black">{course.title}</h2>
                      <p>{course.description.length > 35 ? course.description.slice(0, 35) + "..." : course.description}</p>
                      <button className="btn2">Enroll now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <footer>
          <div className="one">
            <h1>BrainLitix</h1>
            <div className="icons">
              <p>Follow us on</p>
              <div className="inconco">
                <a href=""><FaFacebook /></a>
                <a href=""><FaInstagram /></a>
              </div>
            </div>
          </div>
          <div className="two">
            <h2>connects</h2>
            <p>harshschoollife@gmail.com</p>
            <p>+91 9876543210</p>
            <p>Privacy Policy</p>
          </div>
          <div className="three">
            <p>Copyright © 2021 BrainLitix.</p>
            <p>All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
