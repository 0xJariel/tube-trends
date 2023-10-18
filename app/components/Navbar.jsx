import React from "react";
import { AiOutlineYoutube } from "react-icons/ai";

const Navbar = () => {
  return (
    <div className="flex h-12 bg-white gap-2 shadow-lg">
      <span className="flex pl-6 self-center">
        <AiOutlineYoutube size={34} />
      </span>
      <span className="font-bold text-xl self-center">YouWhen</span>
    </div>
  );
};

export default Navbar;
