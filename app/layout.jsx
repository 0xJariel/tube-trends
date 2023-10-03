import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "YouWhen",
  description: "an app to find out when your favorite youtubers post",
  link: {
    href: "https://api.fontshare.com/v2/css?f[]=satoshi@1,900,700,500,300,400&display=swap",
    rel: "stylesheet",
  },
  link: {
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
    rel: "stylesheet",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
