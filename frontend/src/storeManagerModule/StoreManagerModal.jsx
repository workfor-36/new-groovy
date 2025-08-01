import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import React,{ useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const StoreManagerModal = ({ isOpen, closeModal }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordView = () => setShowPassword(!showPassword);

  // Close modal if clicked outside the modal content
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);

  const handleLogin = async () => {
  try {
    const { data } = await axios.post("http://localhost:4001/api/auth/manager/login", {
      email,
      password,
    });

    // Save token, storeId, and role
    Cookies.set("manager_token", data.token, { expires: 1 });
    Cookies.set("storeId", data.storeId, { expires: 1 });
    Cookies.set("role", data.role || "manager", { expires: 1 });

    alert("Login successful!");
    closeModal();
    navigate("/manager");
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Login failed");
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div
        ref={modalRef}
        className="w-[90%] max-w-sm md:max-w-md h-fit p-5 bg-teal-950 flex-col flex items-center gap-3 rounded-xl shadow-slate-500 shadow-lg justify-center"
      >
        <h1 className="text-lg md:text-xl font-semibold text-white mt-3">
          Welcome to the
        </h1>
        <span className="w-12 md:w-14 text-white">Store</span>

        <div className="w-80 flex flex-col gap-3">
          <div className="w-full h-10 flex items-center gap-2 bg-teal-800 p-2 rounded-xl">
            <MdAlternateEmail />
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent text-white border-0 w-full outline-none text-sm md:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="w-full h-10 flex items-center gap-2 bg-teal-800 p-2 rounded-xl relative">
            <FaFingerprint />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-transparent text-white border-0 w-full outline-none text-sm md:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <p className="text-xs md:text-sm text-gray-500 text-center">
          Forgot Password?{" "}
          <a href="/">
            <button className="text-white cursor-pointer pl-1">Click here</button>
          </a>
        </p>

        <div className="flex justify-between gap-3 w-full text-white h-12 mb-4">
          <button
            className="flex-1 p-2 rounded-xl bg-cyan-900 hover:bg-cyan-950 text-sm md:text-base cursor-pointer"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="flex-1 p-2 bg-cyan-900 rounded-xl hover:bg-cyan-950 text-sm md:text-base cursor-pointer"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreManagerModal;
