import React from "react";
import { Menu } from "lucide-react";

const Header = ({ onMenuClick }) => {
  return (
    <header className="border-b sticky top-0 z-50 w-full border-gray-200 h-16 px-5 flex items-center justify-between bg-white">
      
      {/* Side Menu Icon */}
      <button
        onClick={onMenuClick}
        className="p-2 lg:hidden rounded-md hover:bg-gray-100 transition"
      >
        <Menu size={24} className="text-gray-800" />
      </button>

      <h1 className="text-black font-sans text-xl font-semibold">
        Expense Tracker
      </h1>

      {/* Placeholder for right side if needed */}
      <div></div>
    </header>
  );
};

export default Header;

