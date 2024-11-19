import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Chat } from "@/types/chat";
import withAuth from "@/hoc/withAuth";

const ChatCard = () => {
  const [chatData, setChatData] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Customize items per page

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          setError("No authentication token found");
          return;
        }
  
        const response = await axios.get("http://localhost:8000/api/dosen", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const transformedData: Chat[] = response.data.map((item: any) => ({
          avatar: "/images/brand/default-avatar.png", // Customize this if needed
          name: item.nama,
          text: item.kode, // Adjust as needed
          time: item.sks * 50, // Assuming time is related to SKS (Credit Hours)
          textCount: 0, // Modify this if needed
          dot: item.dosenPengampu.length, // Number of instructors
        }));
  
        setChatData(transformedData);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          setError("Unauthorized. Please log in again.");
          // Optionally, redirect to login page
          // router.push("/login");
        } else {
          console.error("Error fetching data:", error);
          setError("Failed to fetch data");
        }
      }
    };
  
    fetchData();
  }, []);
  

  // Calculate the number of pages, limited to a maximum of 10 pages
  const totalPages = Math.min(Math.ceil(chatData.length / itemsPerPage), 10);

  // Get the items for the current page
  const currentData = chatData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Mata Kuliah Hari ini
      </h4>

      {error && <div className="text-red-500 px-7.5">{error}</div>}

      <div>
        {currentData.map((chat, key) => (
          <Link
            href="/"
            className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-14 w-14 rounded-full">
              <Image
                width={56}
                height={56}
                src={chat.avatar}
                alt="User"
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
              <span
                className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                  chat.dot === 6 ? "bg-meta-6" : `bg-meta-${chat.dot}`
                }`}
              ></span>
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {chat.name}
                </h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {chat.text}
                  </span>
                  <span className="text-xs"> . {chat.time} min</span>
                </p>
              </div>
              {chat.textCount !== 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">
                    {chat.textCount}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between px-7.5 py-3">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-black dark:text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default withAuth(ChatCard);
