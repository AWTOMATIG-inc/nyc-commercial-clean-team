"use client";
import { Toaster } from "react-hot-toast";

const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};
export default ToastProvider;
