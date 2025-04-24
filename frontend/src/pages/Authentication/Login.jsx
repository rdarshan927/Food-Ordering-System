import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // assuming token returned on success
      const decoded = jwtDecode(res.data.token); // use jwt-decode library

      localStorage.setItem("userId", decoded.id);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("username", decoded.username);
      localStorage.setItem('token', res.data.token);
      console.log(res.data.token);
      setUserId(decoded.id);
      setMessage('Login successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleLogin}>
        <h2 className="text-xl mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
        {message && <p className="mt-3 text-center text-sm text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
