"use client";
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
import React, { useState, useRef, useEffect } from "react";

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
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        profileRef.current &&
        e.target instanceof Node &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showProfile]);

  const handleClick = (label: string) => {
    switch (label) {
      case "Home":
        alert("Home not yet created");
        // your navigation or logic
        break;
      case "Profile":
        alert("profile not yet created");
        break;
      case "Settings":
        alert("settings not yet created");
        break;
      case "logout":
        alert("cant logout yet");
        break;
      default:
        alert("Unknown button clicked");
    }
  };

  return (
    <>
      {/* HEADER */}
      <SidebarHeader className="flex items-center gap-3 p-4 border-b">
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

      {/* EXPANDED SIDEBAR CONTENT */}
      {!collapsed && (
        <>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-15 px-10 py-3 rounded-2xl text-sky-400 hover:text-blue-600 hover:bg-blue-100/70 active:bg-blue-200 transition-all duration-200 text-base font-medium"
                onClick={() => handleClick("Home")}
              >
                <FaHome className="text-3xl" />
                <span className="text-xl font-semibold">Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-15 px-10 py-3 rounded-2xl text-sky-400 hover:text-blue-600 hover:bg-blue-100/70 active:bg-blue-200 transition-all duration-200 text-base font-medium" 
                onClick={() => handleClick("Profile")}
              >
                <FaUser className="text-3xl" />
                <span className="text-xl font-semibold">Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-15 px-10 py-3 rounded-2xl text-sky-400 hover:text-blue-600 hover:bg-blue-100/70 active:bg-blue-200 transition-all duration-200 text-base font-medium"
                onClick={() => handleClick("Settings")}
              >
                <FaCog className="text-3xl" />
                <span className="text-xl font-semibold">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarSeparator />

            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-15 px-10 py-3 rounded-2xl text-sky-400 hover:text-blue-600 hover:bg-blue-100/70 active:bg-blue-200 transition-all duration-200 text-base font-medium"
                onClick={() => handleClick("logout")}
              >
                <FaSignOutAlt className="text-3xl" />
                <span className="text-xl font-semibold">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* FOOTER */}
          <SidebarFooter className="mt-auto p-4 border-t text-xs text-gray-500">
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
                <span className="font-medium text-sm text-sky-400">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
            </div>

            {showProfile && (
              <div
                ref={profileRef}
                className="fixed left-24 bottom-10 z-50 w-72 bg-white rounded-xl shadow-2xl border p-6 flex flex-col gap-4 animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border object-cover"
                  />
                  <div>
                    <div className="font-semibold text-base text-sky-400">
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
          </SidebarFooter>
        </>
      )}

      {/* COLLAPSED SIDEBAR */}
      {collapsed && (
        <div className="fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-white/80 border-r shadow-lg px-2 py-4">
          {/* Top section */}
          <div className="flex flex-col items-center gap-4 text-sky-400">
            {/* Hoverable student icon that shows FaBars on hover */}
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
                  <FaBars className="text-xl transition-all duration-200" />
                ) : (
                  <FaUserGraduate className="text-xl text-sky-500 transition-all duration-200" />
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

          {/* Bottom avatar */}
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

          {/* Floating Profile */}
          {showProfile && (
            <div
              ref={profileRef}
              className="fixed left-16 bottom-10 z-50 w-72 bg-white rounded-xl shadow-2xl border p-6 flex flex-col gap-4 animate-fade-in"
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

      {/* Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="bg-white border-r shadow-md">
          <SidebarContentWithCollapse />
        </Sidebar>
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </SidebarProvider>
  );
}
