"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Topbar from "@/components/Topbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ChatWidget from "@/components/chat/ChatWidget";

export default function PublicHeaderFooterWrapper({ children }) {
  const pathname = usePathname();

  // Check if current route is part of the admin dashboard
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      {/* <Topbar /> */}
      <Header />
      {children}
      {/* <ScrollToTopButton /> */}
      <ChatWidget />
      <Footer />
    </>
  );
}
