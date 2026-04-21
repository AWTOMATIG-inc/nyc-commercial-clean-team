"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
export default function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data);
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
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error(error.message);
      console.error("There was a problem with the delete operation:", error);
    }
  };
  const handleRole = async (id, role) => {
    try {
      const formData = new FormData();
      formData.append("role", role);
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.status === 400) {
        return toast.error("Maximum of 5 admin accounts allowed");
      }
      if (!response.ok) {
        return toast.error("Network response was not ok");
      }
      if (response.ok) {
        setUsers(
          users.map((user) => {
            if (user._id === id) {
              return { ...user, role };
            }
            return user;
          }),
        );
        toast.success("Role updated successfully!");
      }
    } catch (error) {
      console.error("There was a problem with the update operation:", error);
      toast.error(error.message);
    }
  };
  return (
    <div className="bg-white max-w-[1050px] min-h-[60vh] p-4 lg:p-8 rounded-lg shadow-md mt-8">
      {users.length === 0 && (
        <div className="w-fit mx-auto text-center">
          <Image
            src="/images/dashboard/empty.png"
            width={400}
            height={400}
            alt="empty"
          />
          <p className="text-gray-500 text-xl mt-8 font-inter">
            There is no user yet!
          </p>
        </div>
      )}
      {users.length > 0 && (
        <Table className="">
          <Thead>
            <Tr className="text-left border-b border-gray-200 !py-4">
              <Th className="py-2">Name</Th>
              <Th className="py-2">Email</Th>
              <Th className="py-2">Role</Th>
              <Th className="py-2">Access</Th>
              <Th className="py-2">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.map((user) => (
              <Tr key={user._id}>
                <Td className="py-2">{user.name}</Td>
                <Td className="py-2">{user.email}</Td>
                <Td className="py-2">{user.role}</Td>
                <Td className="py-2">
                  <select
                    onChange={(e) => handleRole(user._id, e.target.value)}
                    defaultValue={user.role}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </Td>
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
