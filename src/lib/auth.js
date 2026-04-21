import { redirect } from "next/navigation";

export const getAuth = async () => {
  const res = await fetch("/api/auth/profile");
  if (!res.ok) throw new Error("Not authenticated");
  return res.json()
};
export const logout = async (redirectTo="/") => {
  const res = await fetch("/api/auth/logout",{
    method:"POST"
  });
  if (!res.ok) throw new Error("Not authenticated");
  redirect(redirectTo)
  
};
