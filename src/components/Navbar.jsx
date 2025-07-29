import React,{ useState,useRef,useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import AdminModal from "../adminModule/AdminModal";
import CashierModal from "../cashierModule/CashierModal";
import StoreManagerModal from "../storeManagerModule/StoreManagerModal";
import './Navbar.css'

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

    // Modal control states
  const [showAdmin, setShowAdmin] = useState(false);
  const [showStoreManager, setShowStoreManager] = useState(false);
  const [showCashier, setShowCashier] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
     document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="flex justify-between text-center bg-teal-950 sticky w-full">
        <Link to="/" className="title"><span className="text-orange-300">Groovy</span><span className="text-white">Bills</span></Link>
        <ul className="flex">
          <li> <NavLink to="/" >Home</NavLink> </li>
          <li> <NavLink to="/about">About Us</NavLink></li>
          <li className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown} 
              className="py-2 px-4  text-white rounded"
            >
              Login
            </button>
            {dropdownOpen && (
              <div className="dropDown absolute right-0 top-full  w-48 shadow-lg rounded-md z-10">
                <ul >
                  <li>
                    <NavLink 
                      to="/admin-login" 
                      className="block px-4 py-2"
                      onClick={() => {setShowAdmin(true);
                        setDropdownOpen(false);
                      }}
                    >
                      Admin Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/store-manager-login" 
                      className="block px-4 py-2"
                      onClick={() => {setShowStoreManager(true)
                        setDropdownOpen(false);
                      }}
                    >
                      Store Manager Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/cashier-login" 
                      className="block px-4 py-2"
                      onClick={() => {setShowCashier(true)
                        setDropdownOpen(false);
                      }}
                    >
                      Cashier Login
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>
{/* Modals */}
      <AdminModal isOpen={showAdmin} closeModal={() => setShowAdmin(false)} />
      <StoreManagerModal isOpen={showStoreManager} closeModal={() => setShowStoreManager(false)} />
      <CashierModal isOpen={showCashier} closeModal={() => setShowCashier(false)} />

    </>
  );
}

export default Navbar;
