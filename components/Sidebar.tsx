"use client";

import { useState } from "react";
import Link from "next/link";
import { FiHome, FiStar, FiClock } from "react-icons/fi";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav
      className={`fixed top-[8dvh] left-0 h-[calc(100vh-8dvh)] bg-Teal text-darkBlue transition-all duration-300 z-50 ${
        isExpanded ? "w-64" : "w-20"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col items-center pt-6">
        <Link href="/" className="flex items-center space-x-2 px-4 py-3">
          <FiHome className="w-6 h-6" />
          {isExpanded && <span className="text-lg font-medium">Home</span>}
        </Link>

        <Link
          href="/favorites"
          className="flex items-center space-x-2 px-4 py-3"
        >
          <FiStar className="w-6 h-6" />
          {isExpanded && <span className="text-lg font-medium">Favorites</span>}
        </Link>

        <Link
          href="/watch-later"
          className="flex items-center space-x-2 px-4 py-3"
        >
          <FiClock className="w-6 h-6" />
          {isExpanded && (
            <span className="text-lg font-medium">Watch Later</span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
