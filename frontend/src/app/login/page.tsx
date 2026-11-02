"use client";
import React, { useState ,useEffect} from "react";
import {FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css";
import { login ,checkAuth} from "@/api/loginapi";
import Home from "../home/page";
import { useRouter } from "next/navigation";

//jwt responsive should be stored in cookies
function Login() {
  const [showpassword,setShowpassword]=useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();  

  function togglepass(){
    setShowpassword(!showpassword);
    }

  useEffect(() => {
    async function check() {
      const res = await checkAuth();
      if (res.valid) {
        alert(`Already logged in as ${res.username} (${res.role})`);
        router.push('/home'); // Redirect to home page
      }
      setAuthChecked(true);
    }
    check();
  }, []);

  async function log(e:React.FormEvent){
    e.preventDefault();
    const username=(document.getElementById("username") as HTMLInputElement).value;
    const password=(document.getElementById("password") as HTMLInputElement).value;
    try{
      const response=await login(username,password);
      console.log(response);
      alert("Login Successful");
      router.push('/home');
    }
    catch(err){
      alert("Login Failed");
      console.log(err);
    }

  }

    
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-white px-4">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-sm transition-transform hover:scale-[1.02]">
        <div className="flex justify-center mb-6">
          <img
            src="/head.png"
            alt="User"
            className="w-24 h-24 rounded-full shadow-lg border-4 border-sky-300 hover:shadow-sky-400/40 transition-all duration-300"
          />
        </div>

        <form className="flex flex-col gap-6" onSubmit={log}>
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              name="username"
              id="username"
              required
              placeholder=" " // Keep placeholder=" " for the peer-placeholder-shown/not-placeholder-shown utilities to work
              autoComplete="off"
              className="peer w-full border-b-2 border-gray-400 text-gray-800 bg-transparent px-2 pt-7 pb-2 focus:outline-none focus:border-sky-500 transition-all duration-300"
            />
            <label
              htmlFor="username"
              className="absolute left-2 top-7 text-gray-500 text-base transition-all
              peer-placeholder-shown:top-7 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
              peer-focus:top-1 peer-focus:text-sm peer-focus:text-sky-600
              peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-sky-600"
            >
              Username
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showpassword ? "text" : "password"}
              name="password"
              id="password"
              required
              placeholder=" "
              autoComplete="off"
              className="peer w-full border-b-2 border-gray-400 text-gray-800 bg-transparent px-2 pt-7 pb-2 focus:outline-none focus:border-sky-500 transition-all duration-300"
            />
            <span onClick={togglepass}>
              {showpassword?(<FaEye className="absolute right-3 top-8 text-gray-500 cursor-pointer" />):(<FaEyeSlash className="absolute right-3 top-8 text-gray-500 cursor-pointer" />)}
            </span>
            <label
              htmlFor="password"
              className="absolute left-2 top-7 text-gray-500 text-base transition-all
              peer-placeholder-shown:top-7 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
              peer-focus:top-1 peer-focus:text-sm peer-focus:text-sky-600
              peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-sky-600"
            >
              Password
            </label>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-2 bg-sky-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-sky-600 hover:shadow-sky-400/50 active:scale-95 transition-all duration-300"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600 hover:text-sky-600 transition-colors duration-200 cursor-pointer">
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;