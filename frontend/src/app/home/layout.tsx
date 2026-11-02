"use client";

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  School,
  Users,
  UserRound,
  UserRoundCheck,
  X,
} from "lucide-react";
import { checkAuth, logout } from "@/api/loginapi";
import type { AuthSession } from "@/api/loginapi";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const homeItem: NavItem = {
  label: "Overview",
  href: "/home",
  icon: LayoutDashboard,
};

const navigationByRole: Record<string, NavItem[]> = {
  ADMIN: [
    homeItem,
    { label: "Users", href: "/home/users", icon: Users },
    { label: "Students", href: "/home/student", icon: GraduationCap },
    { label: "Classes", href: "/home/classes", icon: School },
    { label: "Subjects", href: "/home/subject", icon: BookOpen },
    { label: "Attendance", href: "/home/attendence", icon: UserRoundCheck },
    { label: "Academic Years", href: "/home/academicyear", icon: CalendarDays },
  ],
  TEACHER: [
    homeItem,
    { label: "Students", href: "/home/student", icon: GraduationCap },
    { label: "Classes", href: "/home/classes", icon: School },
    { label: "Subjects", href: "/home/subject", icon: BookOpen },
    { label: "Attendance", href: "/home/attendence", icon: UserRoundCheck },
  ],
  CLERK: [
    homeItem,
    { label: "Students", href: "/home/student", icon: GraduationCap },
    { label: "Classes", href: "/home/classes", icon: School },
    { label: "Attendance", href: "/home/attendence", icon: UserRoundCheck },
  ],
  USER: [homeItem],
};

function getNavigation(role?: string): NavItem[] {
  const normalizedRole = role?.toUpperCase().replace(/^ROLE_/, "");
  return navigationByRole[normalizedRole ?? ""] ?? [homeItem];
}

function isActiveRoute(pathname: string, href: string) {
  return href === "/home" ? pathname === href : pathname.startsWith(href);
}

function SidebarContent({
  collapsed,
  setCollapsed,
  items,
  username,
  role,
  onLogout,
}: {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  items: NavItem[];
  username: string;
  role: string;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && (
          <Link href="/home" className="flex items-center gap-2 text-sky-700">
            <GraduationCap aria-hidden="true" size={25} />
            <span className="font-bold text-lg">School Portal</span>
          </Link>
        )}
        <button
          type="button"
          className="rounded p-2 text-gray-600 hover:bg-gray-100"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {items.map(({ label, href, icon: Icon }) => {
            const active = isActiveRoute(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? label : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 transition ${
                    active
                      ? "bg-sky-100 text-sky-800"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <Icon aria-hidden="true" size={21} />
                  {!collapsed && <span className="font-medium">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-3">
        <div className={`mb-3 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <UserRound aria-hidden="true" className="shrink-0 text-sky-700" size={34} />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-800">{username}</p>
              <p className="text-xs capitalize text-gray-500">{role.toLowerCase()}</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? "Log out" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut aria-hidden="true" size={20} />
          {!collapsed && <span className="font-medium">Log out</span>}
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [logoutError, setLogoutError] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const username = session?.username ?? "Account";
  const role = session?.role?.toUpperCase().replace(/^ROLE_/, "") ?? "USER";
  const navigation = getNavigation(session?.role);

  useEffect(() => {
    let active = true;
    checkAuth().then((auth) => {
      if (active) setSession(auth);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setShowAccountMenu(false);
  }, [pathname]);

  async function handleLogout() {
    setLogoutError("");
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Could not log out. Please try again.");
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <aside
        className={`shrink-0 border-r bg-white shadow-sm transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          items={navigation}
          username={username}
          role={role}
          onLogout={handleLogout}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-40 border-b bg-white/95 shadow-sm backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <GraduationCap aria-hidden="true" className="shrink-0 text-sky-700" size={25} />
              <h1 className="truncate font-bold text-lg text-sky-700 md:text-xl">
                School Portal
              </h1>
              <nav aria-label="Quick navigation" className="ml-3 hidden items-center gap-4 overflow-x-auto lg:flex">
                {navigation.map(({ label, href }) => {
                  const active = isActiveRoute(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`whitespace-nowrap border-b-2 py-5 text-sm font-medium transition ${
                        active
                          ? "border-sky-600 text-sky-700"
                          : "border-transparent text-gray-600 hover:text-sky-700"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="relative flex shrink-0 items-center gap-3">
              {logoutError && (
                <p role="alert" className="hidden text-sm text-red-600 md:block">
                  {logoutError}
                </p>
              )}
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={showAccountMenu}
                onClick={() => setShowAccountMenu((value) => !value)}
                className="flex items-center gap-2 rounded-lg p-2 text-left hover:bg-gray-100"
              >
                <UserRound aria-hidden="true" className="text-sky-700" size={28} />
                <span className="hidden sm:block">
                  <span className="block max-w-36 truncate text-sm font-semibold text-gray-800">
                    {username}
                  </span>
                  <span className="block text-xs capitalize text-gray-500">
                    {role.toLowerCase()}
                  </span>
                </span>
              </button>

              {showAccountMenu && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
                >
                  <div className="border-b px-2 pb-3">
                    <p className="truncate text-sm font-semibold text-gray-800">{username}</p>
                    <p className="text-xs capitalize text-gray-500">{role.toLowerCase()}</p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut aria-hidden="true" size={17} />
                    Log out
                  </button>
                  {logoutError && (
                    <p role="alert" className="px-2 pt-2 text-xs text-red-600">
                      {logoutError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-3">{children}</main>
      </div>
    </div>
  );
}
