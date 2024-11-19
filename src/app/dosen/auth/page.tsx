"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/Layouts/AuthLayout";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi";  // Import icons

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        email: email,
        password: password,
        role: "dosen",
      });

      console.log(response.data.token);
      localStorage.setItem("token", response.data.token);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat Datang Dosen.",
        showConfirmButton: false,
        timer: 2500,
      });

      router.push("/dosen");
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
              <Link className="mb-5.5 inline-block" href="/">
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
                Dosen Authentication
              </span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white text-center sm:text-left sm:text-title-xl2">
                Sign In 
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email-address" className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email-address"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

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
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Login as {" "}
                    <Link href={'/admin/auth'} className="text-primary">
                      Admin
                    </Link>
                  </p>
                  <p>
                    Login as {" "}
                    <Link href={'/auth'} className="text-primary">
                      Mahasiswa
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
