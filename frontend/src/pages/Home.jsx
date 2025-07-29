import React from 'react';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      

      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-orange-100 to-yellow-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Smarter Billing Starts Here</h2>
          <p className="text-lg text-gray-600 mb-8">
            GroovyBills helps you manage your bills, POS, and customer info in one clean dashboard.
          </p>
          <Link to="/">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-full text-lg hover:bg-orange-600">
            Get Started 
          </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center mb-12">Features</h3>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="text-xl font-semibold mb-2">POS System</h4>
              <p className="text-gray-600">Fast and reliable point of sale system to manage transactions.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="text-xl font-semibold mb-2">Billing Reports</h4>
              <p className="text-gray-600">Generate bills, view reports, and keep your finances transparent.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="text-xl font-semibold mb-2">Customer Management</h4>
              <p className="text-gray-600">Track customer purchases and history with ease.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-500 text-white text-center">
        <div className="container mx-auto px-6">
          <h4 className="text-3xl font-bold mb-4">Ready to simplify your billing?</h4>
          <p className="mb-6">Join hundreds of businesses using GroovyBills.</p>
         <Link to="/"> 
          <button className="bg-white text-orange-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100">
            Try It Now
          </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
       <Footer/> 
    </div>
  );
}

export default Home;
