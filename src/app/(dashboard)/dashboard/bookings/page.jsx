"use client";
import { getColorStatus } from "@/utility/getStatusColor";
import { GetTime } from "@/utility/GetTime";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
const statusList = [
  { color: "bg-gray-400", name: "All" },
  { color: "bg-orange-500", name: "Pending" },
  { color: "bg-green-500", name: "Confirmed" },
  { color: "bg-red-500", name: "Cencelled" },
];
export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [statusVal, setStatusVal] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [isRefresh, setIsRefresh] = useState(false);
  const limit = 10;

  const fetchBookings = async (currentPage, currentStatusVal) => {
    const res = await fetch(
      `/api/booking?page=${currentPage}&limit=${limit}&status=${currentStatusVal}`,
    );
    const result = await res.json();
    if (result.success) {
      setBookings(result.data);
      setTotalPages(result.pagination.totalPages);
    }
  };
  const handleStatusChange = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append("status", status);
      const res = await fetch("/api/booking/" + id, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (data) {
        setIsRefresh(!isRefresh);
        toast.success("Status change successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
   const handleDelete = async (id) => {
    const userConfirmed = confirm("Are you sure you want to delete this item?");
    if (!userConfirmed) return;

    try {
      const response = await fetch(`/api/booking/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setIsRefresh(!isRefresh);
      toast.success("Booking deleted successfully!");
    } catch (error) {
      toast.error(error.message);
      console.error("There was a problem with the delete operation:", error);
    }
  };
  useEffect(() => {
    startTransition(() => {
      fetchBookings(page, statusVal);
    });
  }, [page, statusVal, isRefresh]);

  return (
    <div className="mt-8">
      {bookings.length <= 0 ? (
        <div className="w-fit mx-auto text-center">
          <Image
            src="/images/dashboard/empty.png"
            width={400}
            height={400}
            alt="empty"
          />
          <p className="text-gray-500 text-xl mt-8 font-inter">
            There is no booking yet!
          </p>
        </div>
      ) : (
        <div className="w">
          <div className="bg-slate w-full p-2 rounded-2xl text-slate-300 flex gap-3 mb-1">
            {statusList.map((item, id) => (
              <button
                key={id}
                onClick={() => setStatusVal(item.name.toLowerCase())}
                className="bg-[#1e3370] px-4 py-2 flex gap-1 items-center"
              >
                <span
                  className={`size-2 rounded-full inline-block ${item.color}`}
                ></span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          <div className="border border-gray-500 rounded-xl overflow-hidden">
            <table className="table-auto w-full">
              <thead className="">
                <tr className="bg-slate text-slate-300 text-left">
                  <th className="px-4 py-5">ID</th>
                  <th className="px-2 py-5">CLIENT</th>
                  <th className="px-2 py-5 ">SERVICES</th>
                  <th className="px-2 py-5">LOCATION</th>
                  <th className="px-2 py-5">DATE</th>
                  <th className="px-2 py-5">FIQUENCY</th>
                  <th className="px-2 py-5">STATUS</th>
                  <th className="px-2 py-5">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {bookings?.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className="bg-slate text-slate-400 border-t text-sm"
                  >
                    <td className="px-4 py-2.5 lg:min-w-40">
                      NYC-{booking.bookingId}
                    </td>
                    <td className="px-2 py-2.5 lg:min-w-40 flex flex-col">
                      <span className="text-slate-200 capitalize">
                        {booking.firstName} {booking.lastName}
                      </span>
                      <span className="text-sm">{booking?.companyName}</span>
                      <p className="text-sm">{booking.email}</p>
                    </td>
                    <td className="px-2 py-2.5 lg:min-w-40 max-w-70">
                      <div className="flex flex-wrap gap-2 text-xs">
                        {booking?.services.map((item, sId) => (
                          <span
                            key={sId}
                            className="bg-[#1e3370] px-2 py-1 rounded-lg"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2 py-2.5 lg:min-w-40 ">
                    
                        <span className="">{booking.propertyAddress}</span>
                   
                    </td>
                    <td className="px-2 py-2.5 lg:min-w-40 ">
                      <div className="flex flex-col">
                        <span>{GetTime(booking.preferredStartDate)}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 lg:min-w-40">
                      {booking?.cleaningSchedule}
                    </td>
                    <td className="px-2 py-2.5 lg:min-w-40 ">
                      <div
                        className={` text-sm  p-2 rounded-xl flex items-center gap-1 ${getColorStatus(booking.status)[0]}`}
                      >
                        <span
                          className={`size-2 rounded-full inline-block ${getColorStatus(booking.status)[1]}`}
                        ></span>
                        <select
                          onChange={(e) => handleStatusChange(booking._id,e.target.value)}
                          value={booking.status}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cenceled">Cenceled</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-x-2">
                        <button onClick={() => handleDelete(booking._id)} className="cursor-pointer hover:text-red-500 hover:border-red-500">
                          <Icon
                            icon="mingcute:delete-2-line"
                            width="20"
                            height="20"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-4 py-2 rounded ${
                    page === pageNumber ? "bg-slate text-white" : "bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
