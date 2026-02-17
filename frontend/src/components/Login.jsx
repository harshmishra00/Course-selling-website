import React, { useState } from 'react'
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/user/login',
        { email, password },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('Login successful', response.data);
      toast.success(response.data.message);

      localStorage.setItem("user", response.data.token);
      navigate('/');

    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Login Error!!!");
      }
    }
  };

  return (
    <div>
      <div className="box1">
        <div className="SignLogo">
          <span className='bhead'>Welcome to</span>&nbsp;&nbsp;&nbsp;
          <span className='Head'>BrainLitix</span>
        </div>
        <form className='frm' onSubmit={handleSubmit}>
          <div className="email">
            <label htmlFor="email">Email: </label><br />
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
              required
              placeholder='Type your email'
            />
          </div>

          <div className="pass">
            <label htmlFor="password">Password: </label><br />
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              required
              placeholder='Type your password'
            />
          </div>

          {errorMessage && (
            <div className="mb-4 text-red-600 text-center">{errorMessage}</div>
          )}

          <br /> <br />
          <div className="submit">
            <button type='submit'>Submit</button>
          </div>
          <div className="message">
            <p>
              Don't have an Account? <Link to="/signup">Signup Now!!!</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;
