import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import React,{ useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CashierModal = ({ isOpen}) => {
  const modalRef = useRef(null);
  const navigate = useNavigate(); // ✅ Moved inside the component

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordView = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
  try {
    const {data} = await axios.post("http://localhost:4001/api/auth/cashier/login", {
      email,
      password,
    });

    Cookies.set("cashier_token", data.token, { expires: 1 });
    Cookies.set("cashier_storeId", data.cashier_storeId, { expires: 1 });
    Cookies.set("role", data.role || "cashier",{ expires: 1 } );

    alert("Login successful");
    closeModal();
    navigate("/cashier");
  } catch (err) {
        console.error(err);

    setError(err.response?.data?.message || "Login failed");
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
        className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-teal-950 flex flex-col items-center gap-3 rounded-xl shadow-slate-500 shadow-lg justify-center"
      >
        <h1 className="mt-2 text-lg md:text-xl font-semibold text-white text-center">
          Welcome Back to the Cash Counter!
        </h1>

        <div className="w-80 flex flex-col gap-3">
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

          <div className="w-full h-10 flex items-center gap-2 bg-teal-800 p-2 rounded-xl relative">
            <FaFingerprint />
            <input
              type={showPassword ? "text" : "password"}
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
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
        )}

        <p className="text-xs md:text-sm text-gray-500 text-center">
          Forgot Password?
          <a href="/" className="text-white pl-1">Click here</a>
        </p>

        <div className="flex justify-between gap-5 mt-3 w-full text-white">
          <button
            onClick={handleLogin}
            className="flex-1 p-2 bg-cyan-900 rounded-xl hover:bg-cyan-950 text-sm md:text-base"
          >
            Login
          </button>
          <button
            className="flex-1 p-2 bg-cyan-900 rounded-xl hover:bg-cyan-950 text-sm md:text-base"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashierModal;
