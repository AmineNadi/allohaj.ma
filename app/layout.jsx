import SessionWrapper from "@/components/SessionWrapper"; 
import { Cairo} from "next/font/google";
import "./globals.css";


const cairoSans = Cairo({
  subsets: ["latin"],
  weight: ["400","500","800"],
});


export const metadata = {
  title: "Allohaj.ma",
  description: "اطلب وجبات طازجة ولذيذة من ألو الحاج. توصيل سريع، طلب سهل، وطعم رائع .",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${cairoSans.className}  antialiased`}
      >
        <SessionWrapper>
          {children}
        </SessionWrapper>
        
      </body>
    </html>
  );
}
