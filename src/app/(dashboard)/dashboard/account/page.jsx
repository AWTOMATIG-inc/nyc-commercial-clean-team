"use client";
import Button from "@/components/Button";
import Card from "@/components/dashboard/Card";
import { EditIcon } from "@/components/SvgIcons";
import { useAuth } from "@/hook/useAuth";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function Account() {
  const { user } = useAuth();
  const fileRef = useRef(null);
  const router = useRouter();
  const [isName, setIsName] = useState(false);
  const nameRef = useRef("");
  const [loading, setLoading] = useState(false);

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    if (user?.avatar) {
      formData.append("oldAvatar", user.avatar);
    }
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }
      const data = await response.json();
      window.location.reload();
      console.log(data);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };
  const handleNameChange = async (e) => {
    e.preventDefault();
    const username = nameRef?.current?.value;
    if (!username) return;
    const formData = new FormData();
    formData.append("name", username);
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to change name!");
      }
      const data = await response.json();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.error("Failed to change name!", error);
    }
  };
  return (
    <div>
      <div className="max-w-3/4 mx-auto mt-10">
        <Card className="">
          <h1 className="text-2xl font-bold mb-4">Account Information</h1>
          <div className="grid grid-cols-2">
            <div>
            <h5>Profile picture</h5>
            <div className="border w-fit rounded-md">
              <img
                src={
                  user?.avatar
                    ? `/api/uploads/user/${user?.avatar}`
                    : "/avatar.png"
                }
                alt="User Avatar"
                className="w-40 h-40 "
              />
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleProfileChange}
              hidden
            />
            <button
              onClick={() => fileRef.current.click()}
              className="bg-gold px-4 py-1 rounded-lg mt-4 cursor-pointer"
            >
              Change Profile
            </button>
          </div>

          <div className="space-y-2 mt-8">
            <p className="flex gap-1 items-center">
              <strong>Name:</strong> {user?.name}{" "}
              <button onClick={() => setIsName((prev) => !prev)}>
                <EditIcon className="hover:text-gold cursor-pointer" />
              </button>
            </p>
            {isName && (
              <form onSubmit={handleNameChange} className="gap-1 flex">
                <input
                  type="text"
                  ref={nameRef}
                  defaultValue={user?.name}
                  className="border border-gold rounded-md py-0.5 px-2 focus:outline-none"
                />
                <Button
                  name={loading ? "Changing..." : "Change"}
                  className="!py-0.5 !px-2 !text-base"
                />
              </form>
            )}

            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> {user?.role}
            </p>
          </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
