import React, { useState, useEffect } from "react";
import SignupForm from "../components/auth/SignupForm";
import LoginForm from "../components/auth/LoginForm";
import loginchart from "../assets/images/loginchart.PNG";
import { TrendingUpDown } from "lucide-react";
import { useAppContext } from "../context/context";
import { useNavigate } from "react-router";
import axios from "axios";
import base_url from "../URLS/base_url";

const Auth = () => {
  const [showSignup, setShowSignup] = useState(false);
  const { Profile, setProfile } = useAppContext();
  const navigate = useNavigate();

  console.log(Profile);
  const getUser = async () => {
    try {
      if (Profile) return;
      const res = await axios.get(`${base_url}/Users/getUser`, {
        withCredentials: true,
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };
  useEffect(() => {
    if (Profile && Object.keys(Profile).length > 0) {
      navigate("/home");
    }
    else {
      navigate("/Auth");
    }
  }, [Profile, navigate]);
    useEffect(() => {
      getUser()
  },[]);

  return (
    <div>
      <h1 className="text-black font-sans text-2xl font-semibold absolute top-5 left-5">
        Expense Tracker
      </h1>

      <div className="flex justify-between max-lg:flex-col w-full">
        <section className="flex px-5 items-center h-screen w-full">
          {showSignup ? (
            <SignupForm onChange={() => setShowSignup(false)} />
          ) : (
            <LoginForm onChange={() => setShowSignup(true)} />
          )}
        </section>

        <section className="w-full h-screen relative overflow-hidden bg-[#ccc9db67]">
          <div className="size-40 absolute rounded-br-4xl bg-[#6757ac]"></div>

          <div className="relative rounded-lg z-100 flex gap-3 px-3 items-center h-15 mx-20 max-lg:mx-10 top-10 bg-white">
            <p className="size-8 rounded-full text-white flex items-center justify-center bg-[#6757ac]">
              <TrendingUpDown className="size-5" />
            </p>
            <div className="font-sans">
              <p className="text-xs text-gray-700">
                Track Your Income & Expenses
              </p>
              <p className="font-semibold">$430,000</p>
            </div>
          </div>

          <div className="size-70 border-20 border-[#b73ecf] rounded-4xl absolute translate-y-[50%] -right-30"></div>

          <div className="rounded-2xl absolute bottom-10 z-100 px-5 w-full overflow-hidden">
            <img className="mx-auto" src={loginchart} alt="chart" />
          </div>

          <div className="size-40 rounded-tr-4xl absolute bottom-0 bg-[#6757ac]"></div>
        </section>
      </div>
    </div>
  );
};

export default Auth;
