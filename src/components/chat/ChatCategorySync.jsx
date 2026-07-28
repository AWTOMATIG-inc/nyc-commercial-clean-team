"use client";

import { useEffect } from "react";

export default function ChatCategorySync({ slug }) {
  useEffect(() => {
    try {
      sessionStorage.setItem("chatCategory", slug);
    } catch (error) {
      // sessionStorage unavailable — chat falls back to "chatbot-general".
    }
  }, [slug]);

  return null;
}
