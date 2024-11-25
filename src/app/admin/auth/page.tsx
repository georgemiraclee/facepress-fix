"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/Layouts/AuthLayout";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi";  
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility
  const [role, setRole] = useState("admin"); // State for role selection
  const router = useRouter();

  const navigateToRolePage = (role: string) => {
    if (role === "admin") {
      router.push("/admin/auth");
    } else if (role === "dosen") {
      router.push("/dosen/auth");
    } else if (role === "mahasiswa") {
      router.push("/auth");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    Swal.fire({
      title: "Loading",
      showConfirmButton: false,
      timer: 2500,
      didOpen: () =>{
        Swal.showLoading();
      }
    });
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        email,
        password,
        role,
      });

      console.log(response.data.token);
      localStorage.setItem("token", response.data.token);

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat Datang Admin.",
        showConfirmButton: false,
        timer: 2500,
      });

      router.push("/admin");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Invalid email atau password",
      });
    }
  };

  return (
    <AuthLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link className="mb-5.5 inline-block" href="/auth">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/undip.png"}
                  alt="Logo"
                  width={120}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/undip.png"}
                  alt="Logo"
                  width={120}
                  height={32}
                />
              </Link>
              <p className="2xl:px-20">
                Face Presence Computer Engineering Diponegoro University
              </p>
            </div>
          </div>

          {/* Responsive logo for mobile view */}
          <div className="block xl:hidden w-full text-center mb-2">
            <Link href="/">
              <Image
                src={"/images/logo/undip.png"}
                alt="Logo"
                width={100}
                height={30}
                className="mx-auto"
              />
            </Link>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium text-center sm:text-left">
                Admin Authentication
              </span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white text-center sm:text-left sm:text-title-xl2">
                Sign In 
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Role Selection */}
                <div className="mb-4 text-center">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Select Role
                  </label>
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => navigateToRolePage("admin")}
                      className={`p-4 rounded-lg border ${role === "admin" ? "bg-primary text-white" : "border-stroke dark:border-strokedark"} transition`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateToRolePage("dosen")}
                      className={`p-4 rounded-lg border ${role === "dosen" ? "bg-primary text-white" : "border-stroke dark:border-strokedark"} transition`}
                    >
                      Dosen
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateToRolePage("mahasiswa")}
                      className={`p-4 rounded-lg border ${role === "mahasiswa" ? "bg-primary text-white" : "border-stroke dark:border-strokedark"} transition`}
                    >
                      Mahasiswa
                    </button>
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label htmlFor="email-address" className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email-address"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>

                {/* Password Input */}
                <div className="mb-6">
                  <label htmlFor="password" className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}  // Toggle input type
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Your Password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}  // Toggle password visibility
                      className="absolute right-5 top-5 text-gray-500 dark:text-gray-400"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
