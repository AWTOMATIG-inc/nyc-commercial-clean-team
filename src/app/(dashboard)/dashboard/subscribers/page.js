"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
export default function SubscibersPage() {
  const [subscribers, setSubscribers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/subscriber");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSubscribers(data);
        console.log(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchData();
  }, []);
  const handleDelete = async (id) => {
    const userConfirmed = confirm("Are you sure you want to delete this item?");
    if (!userConfirmed) return;
    try {
      const response = await fetch(`/api/subscriber/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setSubscribers(subscribers.filter((subscriber) => subscriber._id !== id));
      toast.success("Subscriber deleted successfully!");
    } catch (error) {
      toast.error(error.message);
      console.error("There was a problem with the delete operation:", error);
    }
  };

  return (
    <div className="bg-white max-w-[1050px] min-h-[60vh] p-4 lg:p-8 rounded-lg shadow-md mt-8">
      {subscribers.length === 0 && (
        <div className="w-fit mx-auto text-center">
          <Image
            src="/images/dashboard/empty.png"
            width={400}
            height={400}
            alt="empty"
          />
          <p className="text-gray-500 text-xl mt-8 font-inter">
            There is no subscribe email yet!
          </p>
        </div>
      )}
      {subscribers.length > 0 && (
        <Table className="">
          <Thead>
            <Tr className="text-left border-b border-gray-200 !py-4">
              <Th className="py-2">SL</Th>
              <Th className="py-2">Subscribed Email</Th>

              <Th className="py-2">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subscribers?.map((user, index) => (
              <Tr key={user._id}>
                <Td className="py-2">#{index + 1}</Td>
                <Td className="py-2">{user.email}</Td>
                <Td className="py-2">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M10 5h4a2 2 0 1 0-4 0M8.5 5a3.5 3.5 0 1 1 7 0h5.75a.75.75 0 0 1 0 1.5h-1.32l-1.17 12.111A3.75 3.75 0 0 1 15.026 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0zM14.25 9a.75.75 0 0 0-.75.75v7.5a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75"
                      />
                    </svg>
                  </button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
