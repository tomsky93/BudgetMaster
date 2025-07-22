import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import SidebarMenu from "./SidebarMenu";
import { ROUTES } from "../routes/paths";
import useAuth from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      return saved === "true";
    }
    return !!user && isDesktop;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", isSidebarOpen ? "true" : "false");
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (user && window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [user]);

  const isPublicPath =
    location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;

  if (isPublicPath) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={
          `
          fixed top-0 left-0 h-screen w-60
          bg-white border-r border-gray-200 shadow-sm
          transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          z-40
        `
        }
      >
        <div className="flex justify-end p-2">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="
              p-1
              bg-white
              hover:bg-gray-100
              focus:outline-none
              rounded-full
              shadow-sm
              transition
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <SidebarMenu onLogout={handleLogout} />
      </aside>

      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="
            fixed top-4 left-4 z-50
            bg-white shadow-md
            rounded-full
            p-2
            focus:outline-none
            hover:bg-gray-100
            transition
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      <div
        className={
          `
          flex flex-col flex-1
          transition-all duration-200 ease-in-out
          ${isSidebarOpen ? "md:ml-60" : "md:ml-0"}
          overflow-auto
        `
        }
      >
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
