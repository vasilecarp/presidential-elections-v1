import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";
import Navigation from "../components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Presidential Elections",
  description: "A platform for conducting presidential elections",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
