// export default Login;
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

      const decoded = jwtDecode(res.data.token);

      localStorage.setItem("userId", decoded.id);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("username", decoded.username);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('useremailc', res.data.user.email);

      console.log("Login successful:", res.data.user.email);

      setUserId(decoded.id);
      setMessage('Login successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80)' }}>
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome Back!</h2>
        <form className="w-full" onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white py-3 rounded-xl font-semibold shadow-md"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
