import Footer from "@/components/Footer";
import GTMPageTracker from "@/components/GTMPageTracker";
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ToastProvider from "@/components/ToastProvider";
import Topbar from "@/components/Topbar";
import { GoogleTagManager } from "@next/third-parties/google";
import { Inter, JetBrains_Mono } from "next/font/google";
import "swiper/css";
import "./globals.css";
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  variant: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  variant: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "NYC-SERVICES",
  description: "Commercial cleaning services in NYC",

  metadataBase: new URL("https://nyccleantinc.com"),

  icons: {
    icon: "/favicon.png",
  },

  openGraph: {
    title: "NYC-SERVICES",
    description: "Commercial cleaning services in NYC",
    url: "https://nyccleantinc.com",
    siteName: "NYC-SERVICES",
    locale: "en_US",
    type: "website",

    images: [
      {
        url: "https://nyccleantinc.com/images/home/services/floor-moping.jpg",
        width: 1200,
        height: 630,
        alt: "Floor Moping Service",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NYC-SERVICES",
    description: "Commercial cleaning services in NYC",
    images: [
      "https://nyccleantinc.com/images/home/services/floor-moping.jpg",
    ],
  },

  other: {
    "pinterest-rich-pin": "true",
  },
};
export default function RootLayout({ children }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <head></head>
      {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
      <body
        className={`${jetBrainsMono.variable} ${inter.variable} antialiased`}
      >
        <ToastProvider>
          <GTMPageTracker />
          <Topbar />
          <Header />
          {children}
          <ScrollToTopButton />
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
