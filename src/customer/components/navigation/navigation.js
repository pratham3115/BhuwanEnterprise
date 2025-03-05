import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/BELOGO.jpg";

const navigation = {
  categories: [
    { id: "Home", name: "Home", href: "/" },
    { id: "About", name: "About", href: "/about" },
  ],
  pages: [
    { name: "Products", href: "/products" },
    { name: "Contact Us", href: "/contact" },
  ],
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false); // Close mobile menu on logout
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center justify-start">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Bhuwan Enterprise Logo" className="h-10 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-800">Bhuwan Enterprise</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
            {navigation.categories.map((category) => (
              <Link key={category.id} to={category.href} className="text-sm font-medium text-gray-700 hover:text-gray-900">
                {category.name}
              </Link>
            ))}
            {navigation.pages.map((page) => (
              <Link key={page.name} to={page.href} className="text-sm font-medium text-gray-700 hover:text-gray-900">
                {page.name}
              </Link>
            ))}
            {user && (
              <Link to="/orders" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                My Orders
              </Link>
            )}
          </div>

          {/* Login / Logout Button */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-800">Hello, {user.name}</span>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">Login</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => setOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <Dialog open={open} onClose={() => setOpen(false)} className="lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/25" />
        <DialogPanel className="fixed inset-y-0 left-0 w-full max-w-xs bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Bhuwan Enterprise Logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-800">Bhuwan Enterprise</span>
            </Link>
            <button type="button" className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none" onClick={() => setOpen(false)}>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6">
            {navigation.categories.map((category) => (
              <Link key={category.id} to={category.href} className="block text-gray-800 font-medium mb-2">
                {category.name}
              </Link>
            ))}
            {navigation.pages.map((page) => (
              <Link key={page.name} to={page.href} className="block text-gray-800 font-medium mb-2">
                {page.name}
              </Link>
            ))}
            {user && (
              <Link to="/orders" className="block text-gray-800 font-medium mb-2">
                My Orders
              </Link>
            )}
          </div>

          {/* Mobile Login/Logout Button */}
          <div className="mt-6">
            {user ? (
              <>
                <span className="block text-gray-800 font-medium mb-2">Hello, {user.name}</span>
                <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="w-full block text-center bg-blue-500 text-white py-2 rounded">
                Login
              </Link>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
