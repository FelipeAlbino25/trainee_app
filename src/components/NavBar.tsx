import React from "react";

const NavBar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-[#5B5B5B] to-[#4C4444] z-100 shadow-md px-4 flex items-center justify-between text-white">
      <span className="text-lg sm:text-xl font-extrabold tracking-wider">
        ALBINO TASKS
      </span>
      <img className="h-6 w-6 sm:h-8 sm:w-8" src="/user.svg" />
    </nav>
  );
};

export default NavBar;
