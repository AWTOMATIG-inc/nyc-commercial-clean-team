"use client";

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className=" size-10 flex justify-center items-center fixed bottom-5 right-5 text-xl bg-red text-white px-4 py-2 rounded-full shadow-lg hover:bg-slate transition z-999"
    >
      ↑
    </button>
  );
}