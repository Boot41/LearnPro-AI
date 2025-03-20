import React, { useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LogOut,
  Menu,
  X,
  BookOpen,
  User,
  BarChart,
  Info,
  Mail,
  HelpCircle,
  Presentation,
  FileSpreadsheet,
} from "lucide-react";
import Github from "../assets/github.svg";
const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Outlet />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for larger screens */}
      <aside
        className={`bg-indigo-700 text-white w-64 fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-200 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-800">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-bold">LearnPro AI</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2 ">
            {user.role === "admin" ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-indigo-800"
                >
                  <BarChart className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/assign_kt"
                  className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-indigo-800"
                >
                  <Presentation className="h-5 w-5" />
                  <span>Project Overview</span>
                </Link>
                <Link
                  to="/assign_github_kt"
                  className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-indigo-800"
                >
                  <img src={Github} alt="GitHub" className="h-6 w-6" />
                  <span>GitHub KT</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/learning-path"
                  className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-indigo-800"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Learning Path</span>
                </Link>
                <Link
                  to="/knowledge_transfer"
                  className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-indigo-800"
                >
                  <Presentation className="h-5 w-5" />
                  <span>Project Overview</span>
                </Link>
                <Link
                  to="/github_knowledge_transfer"
                  className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-indigo-800"
                >
                  <img src={Github} alt="GitHub" className="h-6 w-6 " />
                  <span>GitHub KT</span>
                </Link>
              </>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="mt-8 py-4 border-t border-indigo-800">
              <p className="px-4 text-sm font-medium text-indigo-200 mb-2">
                Information
              </p>
              <Link
                to="/about"
                className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-indigo-800"
              >
                <Info className="h-5 w-5" />
                <span>About Us</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-indigo-800"
              >
                <Mail className="h-5 w-5" />
                <span>Contact</span>
              </Link>
              <Link
                to="/faq"
                className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-indigo-800"
              >
                <HelpCircle className="h-5 w-5" />
                <span>FAQ</span>
              </Link>
            </div>
            <div className="border-t border-indigo-800 pt-4">
              <div className="flex">
                <div className="flex w-[100%] items-center mb-4">
                  <div className="h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                    <User className="h-6 w-10" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-indigo-200">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-[20%] items-center space-x-2 text-indigo-200 hover:text-white "
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Top navigation */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 md:ml-0">
            <h1 className="text-xl font-semibold text-gray-800">
              {user.role === "admin" ? "Admin Dashboard" : "Learning Portal"}
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;
