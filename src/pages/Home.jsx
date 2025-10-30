import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Income from "../components/Income";
import Expenses from "../components/Expenses";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/context";

const Home = () => {
  const { Profile } = useAppContext();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 👈 sidebar visibility

  // ✅ Redirect to Auth if user not logged in
  useEffect(() => {
    if (!Profile?._id) {
      navigate("/Auth");
    }
  }, [Profile?._id, navigate]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 fixed lg:static z-40 h-full transition-all duration-300 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:w-1/4 xl:w-1/6 w-64`}
        >
          <Sidebar />
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-opacity-30 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="grow overflow-y-auto bg-gray-50 lg:ml-0">
          <Dashboard />
          <Income />
          <Expenses />
        </main>
      </div>
    </div>
  );
};

export default React.memo(Home);
