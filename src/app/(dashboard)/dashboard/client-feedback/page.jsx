"use client";
import { GetTime } from "@/utility/GetTime";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/feedback");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFeedbacks(data);
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
      const response = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
      toast.success("Feedback deleted successfully!");
    } catch (error) {
      toast.error(error.message);
      console.error("There was a problem with the delete operation:", error);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between mt-8">
        <h1 className="text-2xl font-bold">Client Feedback list</h1>
        <Link
          className="bg-slate text-white px-4 py-2 rounded-xl"
          href="/dashboard/client-feedback/create"
        >
          {" "}
          Create new Feedback
        </Link>
      </div>
      <div className="bg-white max-w-[1050px] min-h-[60vh] p-4 lg:p-8 rounded-lg shadow-md mt-8">
        {feedbacks.length === 0 && (
          <div className="w-fit mx-auto text-center">
            <Image
              src="/images/dashboard/empty.png"
              width={400}
              height={400}
              alt="empty"
            />
            <p className="text-gray-500 text-xl mt-8 font-inter">
              There is no feedback yet!
            </p>
          </div>
        )}
        {feedbacks.length > 0 && (
          <Table className="">
            <Thead>
              <Tr className="text-left border-b border-gray-200 !py-4">
                <Th className="py-2">Client</Th>
                <Th className="py-2">Feedback</Th>
                <Th className="py-2 md:px-4">Rating</Th>
                <Th className="py-2">Feedback Date</Th>
                <Th className="py-2">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {feedbacks?.map((feedback) => (
                <Tr key={feedback._id}>
                  <Td className="py-2">
                    <div>
                      <Image src={`/api/uploads/feedback/${feedback.image}`} alt="avatar" width={50} height={50} className="size-12 rounded-xl"/>
                      <p className="mt-1">{feedback.clientName}</p>
                    </div>
                  </Td>
                  <Td className="py-2 md:max-w-40 text-justify">{feedback.feedback.slice(0, 100)}...</Td>
                  <Td className="py-2 md:px-8 md:w-30">{feedback.rating}</Td>
                  <Td className="py-2">{GetTime(feedback.feedbackDate)}</Td>
                  
                  <Td className="py-2">
                    <button
                      onClick={() => handleDelete(feedback._id)}
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
    </div>
  );
}
