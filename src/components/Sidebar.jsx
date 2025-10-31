import React, { useEffect, useState, useCallback } from "react";
import { LayoutDashboard, Wallet, TrendingDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/context";
import base_url from "../URLS/base_url";
import axios from "axios";
import toast from "react-hot-toast";

const Sidebar = React.memo(() => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { internalActiveSection, setInternalActiveSection, Profile, setProfile,transactions, settransactions } =
    useAppContext();
  const navigate = useNavigate();

  const getUser =async () => {
    try {
      if (Profile) return;
      const res = await axios.get(`${base_url}/Users/getUser`, {
        withCredentials: true,
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  }
   const getData = useCallback(async () => {
    try {
      const res = await axios.get(`${base_url}/Data/getAlldata`, {
        withCredentials: true,
      });
      console.log("data in home page", res.data);
      settransactions(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [settransactions]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getUser();
  }, []);

  const logout = useCallback(async () => {
    try {
      setLogoutLoading(true);
      await axios.post(`${base_url}/Auth/logout`, {}, { withCredentials: true });
      toast.success("Logout Successfully");
      setProfile(null);

      setTimeout(() => {
        setLogoutLoading(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      setLogoutLoading(false);
      console.error(error);
    }
  }, [navigate, setProfile]);

  if (!Profile) {
    return (
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r h-screen border-gray-200 p-6 items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </aside>
    );
  }

  return (
    <aside className="max-lg:fixed lg:flex flex-col w-64 bg-white border-r h-screen border-gray-200 p-6">
      <div className="flex flex-col items-center mb-10">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center">
          <img
            src={Profile.pic || "https://via.placeholder.com/150"}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="mt-4 text-gray-800 font-semibold text-lg">
          {Profile.fullName || "User"}
        </h2>
      </div>

      <nav className="flex-1">
        <ul className="space-y-3">
          {[
            { id: "Dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
            { id: "Income", icon: <Wallet size={20} />, label: "Income" },
            { id: "Expenses", icon: <TrendingDown size={20} />, label: "Expense" },
          ].map((item) => (
            <li key={item.id}>
              <a
                onClick={() => {setInternalActiveSection(item.id)
                   
                }}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  internalActiveSection === item.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-700"
                } font-medium transition hover:text-white cursor-pointer hover:bg-purple-700`}
              >
                {item.icon}
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              onClick={logout}
              className="flex items-center gap-3 p-3 rounded-xl text-gray-700 font-medium transition hover:text-white cursor-pointer hover:bg-purple-700"
            >
              <LogOut size={20} />
              {logoutLoading ? "Logging out..." : "Logout"}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
});

export default Sidebar;
