
"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  FaBars,
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaUserGraduate,
} from "react-icons/fa";
import UsersPage from "./users/page";

/* ------------------ SIDEBAR COMPONENT ------------------ */
function SidebarContentWithCollapse() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  const user = {
    name: "John Doe",
    email: "john.doe@email.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const [showProfile, setShowProfile] = useState(false);
  const [hovered, setHovered] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        profileRef.current &&
        e.target instanceof Node &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    }
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
      case "logout":
        alert("Cannot logout yet");
        break;
      default:
        alert("Unknown button clicked");
    }
  };

  return (
    <>
      <SidebarHeader className="flex items-center gap-3 p-4 border-b bg-white">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <FaUserGraduate className="text-sky-600 text-2xl" />
            <span className="font-bold text-xl text-sky-600 tracking-wide">
              Student
            </span>
          </div>
        )}
        <SidebarTrigger className="ml-auto p-2 rounded hover:bg-gray-100 hover:cursor-ew-resize">
          <FaBars />
        </SidebarTrigger>
      </SidebarHeader>

      {!collapsed && (
        <>
          <SidebarMenu>
            {[
              { icon: <FaHome className="text-2xl" />, label: "Home" },
              { icon: <FaUser className="text-2xl" />, label: "Users" },
              { icon: <FaCog className="text-2xl" />, label: "Settings" },
            ].map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sky-400 hover:text-blue-600 hover:bg-blue-100/70 active:bg-blue-200 transition-all duration-200 text-base font-medium"
                  onClick={() => handleClick(item.label)}
                >
                  {item.icon}
                  <span className="text-lg font-semibold">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <SidebarSeparator />

            <SidebarMenuItem>
              <SidebarMenuButton
                className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sky-400 hover:text-blue-600 hover:bg-blue-100/70 active:bg-blue-200 transition-all duration-200 text-base font-medium"
                onClick={() => handleClick("logout")}
              >
                <FaSignOutAlt className="text-2xl" />
                <span className="text-lg font-semibold">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarFooter className="mt-auto p-4 border-t text-xs text-gray-500 bg-white">
            <div className="relative">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setShowProfile((v) => !v)}
              >
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-sky-600">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>

              {showProfile && (
                <div
                  ref={profileRef}
                  className="absolute left-0 bottom-14 z-50 w-72 bg-white rounded-xl shadow-2xl border p-6 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-12 h-12 rounded-full border object-cover"
                    />
                    <div>
                      <div className="font-semibold text-base text-sky-600">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>

                  <hr />

                  <button className="w-full py-2 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 transition">
                    Logout
                  </button>
                  <button className="w-full py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition">
                    Login with another account
                  </button>
                </div>
              )}
            </div>
          </SidebarFooter>
        </>
      )}

      {/* ✅ Collapsed Sidebar */}
      {collapsed && (
        <div className="fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-white border-r shadow-md px-2 py-4 w-[70px]">
          <div className="flex flex-col pt-13 items-center gap-4 text-sky-400">
            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <button
                className="p-2 hover:bg-gray-100 hover:cursor-ew-resize hover:text-blue-600 rounded transition-all duration-200"
                onClick={toggleSidebar}
                title="Expand Sidebar"
              >
                {hovered ? (
                  <FaBars className="text-xl" />
                ) : (
                  <FaUserGraduate className="text-xl text-sky-500" />
                )}
              </button>
            </div>

            <button
              className="p-2 hover:bg-gray-100 hover:text-blue-600 rounded"
              title="Home"
            >
              <FaHome />
            </button>
            <button
              className="p-2 hover:bg-gray-100 hover:text-blue-600 rounded"
              title="Profile"
            >
              <FaUser />
            </button>
            <button
              className="p-2 hover:bg-gray-100 hover:text-blue-600 rounded"
              title="Settings"
            >
              <FaCog />
            </button>
            <div className="border-t w-8 my-2" />
            <button
              className="p-2 hover:bg-gray-100 hover:text-blue-600 rounded"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>

          <div
            className="flex justify-center cursor-pointer mt-4"
            onClick={() => setShowProfile((v) => !v)}
          >
            <img
              src={user.avatar}
              alt="avatar"
              className="w-9 h-9 rounded-full border object-cover"
            />
          </div>

          {showProfile && (
            <div
              ref={profileRef}
              className="fixed left-[80px] bottom-10 z-50 w-72 bg-white rounded-xl shadow-2xl border p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border object-cover"
                />
                <div>
                  <div className="font-semibold text-base text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
              <hr />
              <button className="w-full py-2 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 transition">
                Logout
              </button>
              <button className="w-full py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition">
                Login with another account
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ------------------ DASHBOARD LAYOUT ------------------ */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="bg-white border-r shadow-md flex-shrink-0">
          <SidebarContentWithCollapse />
        </Sidebar>

        {/* ✅ Main Content Adjusts Automatically */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Top Navbar */}
          <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-10">
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

                <button
                  className="relative p-2 rounded-full hover:bg-gray-100 transition"
                  title="Notifications"
                >
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

                <div
                  className="relative"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="profile"
                    className="w-9 h-9 rounded-full border cursor-pointer hover:shadow-md transition-all duration-200"
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
                            <p className="text-sm font-semibold text-sky-600">
                              John Doe
                            </p>
                            <p className="text-xs text-gray-500">
                              john.doe@email.com
                            </p>
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

          {/* ✅ Full-Screen Main Content */}
          <main className="flex-1 h-full overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
