import Footer from "@/components/Footer";
import GTMPageTracker from "@/components/GTMPageTracker";
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ToastProvider from "@/components/ToastProvider";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <body
        className={`${jetBrainsMono.variable} ${inter.variable} antialiased`}
      >
        {GTM_ID && (
          <>
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${GTM_ID}');
                `,
              }}
            />
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        <ToastProvider>
          <GTMPageTracker />
          <Header />
          {children}
          <ScrollToTopButton />
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
