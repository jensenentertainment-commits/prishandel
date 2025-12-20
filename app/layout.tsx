import "./globals.css";
import SupportChat from "./components/SupportChat";
import { GeistSans, GeistMono } from "geist/font";
import ShopNavbar from "./components/ShopNavBar";
import SiteFooter from "./components/SiteFooter";
import CookieBanner from "./components/CookieBanner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body className={`${GeistSans.className} bg-neutral-100 text-black`}>
        <ShopNavbar />
          
        

        <main>{children}</main>
<SiteFooter />
<CookieBanner />
<SupportChat />
      </body>
    </html>
  );
}
