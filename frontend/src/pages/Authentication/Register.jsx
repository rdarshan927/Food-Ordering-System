// import React, { useState } from 'react';
// import axios from 'axios';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     name: '',
//     email: '',
//     password: '',
//     role: '',
//   });

//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/register', formData);
//       setMessage('Registration successful 🎉');
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Registration failed 💀');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleRegister}>
//         <h2 className="text-2xl mb-4 text-center font-semibold">Register</h2>

//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           className="w-full mb-3 p-2 border rounded"
//           value={formData.username}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           className="w-full mb-3 p-2 border rounded"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="w-full mb-3 p-2 border rounded"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="w-full mb-3 p-2 border rounded"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />

//         <select
//           name="role"
//           className="w-full mb-3 p-2 border rounded"
//           value={formData.role}
//           onChange={handleChange}
//           required
//         >
//           <option value="">Select Role</option>
//           <option value="USER">User</option>
//           <option value="ADMIN">Admin</option>
//           <option value="DRIVER">Driver</option>
//         </select>

//         <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
//           Register
//         </button>

//         {message && <p className="mt-3 text-center text-sm text-blue-600">{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('Registration successful 🎉');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed 💀');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1400&q=80)',
      }}
    >
      <form
        className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 flex flex-col items-center"
        onSubmit={handleRegister}
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Create an Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 outline-none"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 outline-none"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 outline-none"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 outline-none"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full mb-6 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 outline-none"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="DRIVER">Driver</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 transition-colors text-white py-3 rounded-xl font-semibold shadow-md"
        >
          Register
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-blue-800 font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
