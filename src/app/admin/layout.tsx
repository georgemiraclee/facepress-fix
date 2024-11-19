"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/admin/auth");
      return;
    }

  }, [router]);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {children}
    </div>
  );
}