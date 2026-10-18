import React from 'react';
import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-black text-white h-16 px-8 border-b border-neutral-900 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
        <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-white to-neutral-400 text-black flex items-center justify-center text-xs font-black">
          C
        </span>
        <span className="elsie-black tracking-wider text-xl">CraftCV</span>
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm text-neutral-300 font-sans">
        <Link to="/templates" className="hover:text-white transition-colors">
          Templates
        </Link>
        <Link to="/portfolio/demo" className="hover:text-white transition-colors">
          Showcase
        </Link>
        <a href="#features" className="hover:text-white transition-colors">
          Features
        </a>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/templates" className="text-neutral-400 hover:text-white text-xs transition-colors hidden sm:inline">
          Explore
        </Link>
        <Link
          to="/builder"
          className="text-black bg-white hover:bg-neutral-200 px-5 py-2.5 rounded-3xl text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          Launch Builder
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
