import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import React,{ useState, useEffect, useRef } from "react";
import axios from "axios";

const AdminModal = ({ isOpen}) => {
  const modalRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordView = () => setShowPassword(!showPassword);

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");  

  try {
    const response = await axios.post(
      "http://localhost:4001/api/admin/login", 
      { email: email, password: password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // This allows the cookie to be sent and received
      }
    );

    if (response.status === 200) {
      window.location.href = "/admin";  // Redirect to admin dashboard
    }
  } catch (err) {
    setLoading(false);
    setError(err.response?.data?.message || "Login failed. Please try again.");
    console.error("Login error:", err);
  }
};

const handleClose = ()=>{
  window.location.href="/"
}; 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center">
      <div
        ref={modalRef}
        className="w-[90%] max-w-sm md:max-w-md lg:max-w-md h-2/4 p-5 bg-teal-950 flex-col flex items-center gap-3 rounded-xl shadow-slate-500 shadow-lg justify-center"
      >
        <h1 className="text-lg md:text-xl font-semibold text-white">Welcome Back</h1>
        <h1 className="text-lg md:text-xl font-semibold text-white">Admin</h1>

        <div className="w-80 flex flex-col gap-3">
          {/* Email input */}
          <div className="w-full h-10 flex items-center gap-2 bg-teal-800 p-2 rounded-xl">
            <MdAlternateEmail />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-white border-0 w-full outline-none text-sm md:text-base"
            />
          </div>

          {/* Password input */}
          <div className="w-full h-10 flex items-center gap-2 bg-teal-800 p-2 rounded-xl relative">
            <FaFingerprint />
            <input
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-white border-0 w-full outline-none text-sm md:text-base"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            )}
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <p className="text-xs md:text-sm text-gray-500 text-center">
            Forget Password?{" "}
            <a href="/">
              <button className="text-white cursor-pointer pl-1">Click here</button>
            </a>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-3 mt-4 w-full text-white h-12">
          <button
            className="flex-1 p-2 bg-cyan-900 rounded-xl hover:bg-cyan-950 text-sm md:text-base cursor-pointer"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            className="flex-1 p-2 bg-cyan-900 rounded-xl hover:bg-cyan-950 text-sm md:text-base cursor-pointer"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
