import SessionWrapper from "@/components/SessionWrapper"; 
import { Cairo } from "next/font/google";
import "./globals.css";
import DynamicManifest from "@/components/DynamicManifest";

const cairoSans = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "800"],
});

export const metadata = {
  title: "Allohaj.ma",
  description: "اطلب وجبات طازجة ولذيذة من ألو الحاج. توصيل سريع، طلب سهل، وطعم رائع .",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" >
      <head>
        <link rel="manifest" href="/manifest-client.json" />
        <meta name="theme-color" content="#8936FF" />
        <link rel="apple-touch-icon" href="/icon512_rounded.png" />
      </head>
      <body className={`${cairoSans.className} antialiased`}>
        <DynamicManifest />
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
