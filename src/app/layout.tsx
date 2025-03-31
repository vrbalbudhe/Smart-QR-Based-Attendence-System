import type { ReactNode } from "react";
import "./globals.css";
import NavigationBar from "./components/Homepage/NavigationBar";
import Footer from "./components/Homepage/Footer";
import { AuthProvider } from "./contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="font-sans">
          <NavigationBar />
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="w-[95%] flex flex-col justify-center items-center">
              {children}
            </div>
          </div>
          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
