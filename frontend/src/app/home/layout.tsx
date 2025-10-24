"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaUserGraduate,
} from "react-icons/fa";

function SidebarContent({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }) {
  const user = {
    name: "John Doe",
    email: "john.doe@email.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    if (showProfile) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showProfile]);

  const handleClick = (label: string) => {
    switch (label) {
      case "Home":
        alert("Home not yet created");
        break;
      case "Users":
        window.location.href = "/home/users";
        break;
      case "Settings":
        alert("Settings not yet created");
        break;
      case "Logout":
        alert("Logout not implemented yet");
        break;
    }
  };

  const menuItems = [
    { icon: <FaHome className="text-2xl" />, label: "Home" },
    { icon: <FaUser className="text-2xl" />, label: "Users" },
    { icon: <FaCog className="text-2xl" />, label: "Settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <FaUserGraduate className="text-sky-600 text-2xl" />
            <span className="font-bold text-xl text-sky-600 tracking-wide">Student</span>
          </div>
        )}
        <div
          className="p-2 rounded hover:bg-gray-100 cursor-pointer"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </div>
      </div>

      {/* Menu */}
      {!collapsed ? (
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleClick(item.label)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sky-500 hover:bg-sky-100 hover:text-sky-700 transition-all"
              >
                {item.icon}
                <span className="font-semibold text-lg">{item.label}</span>
              </button>
            ))}

            <hr className="my-2" />

            <button
              onClick={() => handleClick("Logout")}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-100 hover:text-red-600 transition-all"
            >
              <FaSignOutAlt className="text-2xl" />
              <span className="font-semibold text-lg">Logout</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-auto p-4 border-t bg-white relative">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setShowProfile((v) => !v)}
            >
              <img src={user.avatar} className="w-9 h-9 rounded-full border" alt="avatar" />
              <div>
                <div className="text-sky-600 font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>

            {showProfile && (
              <div
                ref={profileRef}
                className="fixed left-18 bottom-15 w-72 bg-white rounded-xl shadow-2xl border p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={user.avatar} className="w-12 h-12 rounded-full border" alt="avatar" />
                  <div>
                    <div className="font-semibold text-base text-sky-600">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                <hr />
                <button className="w-full py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">Logout</button>
                <button className="w-full py-2 border rounded-lg hover:bg-gray-100 transition">Login with another account</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Collapsed Sidebar */
        <div className="flex flex-col justify-between items-center flex-1 py-4">
          <div className="flex flex-col items-center gap-3">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleClick(item.label)}
                className="p-3 rounded-lg text-sky-500 hover:bg-gray-100 hover:text-sky-600 transition"
                title={item.label}
              >
                {item.icon}
              </button>
            ))}

            <hr className="w-10 border-gray-200 my-3" />

            <button
              onClick={() => handleClick("Logout")}
              className="p-3 rounded-lg hover:bg-gray-100 hover:text-red-600 transition"
              title="Logout"
            >
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>

          <div
            className="cursor-pointer"
            onClick={() => setShowProfile((v) => !v)}
          >
            <img src={user.avatar} className="w-9 h-9 rounded-full border" alt="avatar" />
          </div>

          {showProfile && (
            <div
              ref={profileRef}
              className="fixed left-[80px] bottom-10 w-72 bg-white rounded-xl shadow-2xl border p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <img src={user.avatar} className="w-12 h-12 rounded-full border" alt="avatar" />
                <div>
                  <div className="font-semibold text-base text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
              <hr />
              <button className="w-full py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">Logout</button>
              <button className="w-full py-2 border rounded-lg hover:bg-gray-100 transition">Login with another account</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 bg-white border-r shadow-md ${
          collapsed ? "w-15" : "w-45"
        } flex-shrink-0`}
      >
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b shadow-sm">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-pointer">
                <FaUserGraduate className="text-sky-600 text-2xl" />
                <h1 className="font-bold text-xl text-sky-600 tracking-wide">
                  Student Portal
                </h1>
              </div>

              <div className="hidden md:flex items-center gap-6">
                {["Home", "Courses", "Dashboard", "Reports"].map((item) => (
                  <button
                    key={item}
                    className="relative text-gray-700 hover:text-sky-600 font-medium transition group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-sky-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Search */}
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm transition-all w-48 focus:w-64"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute left-3 top-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                  />
                </svg>
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition" title="Notifications">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600 hover:text-sky-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-4.978M13 21a2 2 0 01-4 0"
                  />
                </svg>
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                  3
                </span>
              </button>

              {/* Profile */}
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="profile"
                  className="w-9 h-9 rounded-full border cursor-pointer hover:shadow-md transition"
                />

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-200 rounded-xl shadow-xl animate-fade-in">
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3 border-b pb-3">
                        <img
                          src="https://randomuser.me/api/portraits/men/32.jpg"
                          alt="profile"
                          className="w-10 h-10 rounded-full border object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-sky-600">John Doe</p>
                          <p className="text-xs text-gray-500">john.doe@email.com</p>
                        </div>
                      </div>

                      <button className="w-full py-2 text-sm rounded-lg hover:bg-sky-100 text-left hover:text-sky-600 transition">
                        View Profile
                      </button>
                      <button className="w-full py-2 text-sm rounded-lg hover:bg-sky-100 text-left hover:text-sky-600 transition">
                        Settings
                      </button>
                      <button className="w-full py-2 text-sm text-red-600 rounded-lg hover:bg-red-100 text-left transition">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <style>{`
            .animate-fade-in {
              animation: fadeIn 0.2s ease;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-3 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
