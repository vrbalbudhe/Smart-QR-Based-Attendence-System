"use client";

import { useAuth } from "@app/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavigationBar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  console.log(user);

  return (
    <nav className="bg-[#faf9f9] w-full py-4 fixed px-10 h-16 z-30 flex justify-center items-center">
      <div className="w-[95%] mx-auto flex justify-between items-center">
        <div
          onClick={() => router.push("/")}
          className="text-md cursor-pointer tracking-tight font-semibold text-gray-800"
        >
          Event Check-In
        </div>
        <div className="flex justify-center items-center gap-4">
          <Link
            href="/"
            className="text-gray-800 hover:text-blue-500 text-sm -tracking-tight transition-colors"
          >
            Home
          </Link>
          <Link
            href="/events"
            className="text-gray-800 hover:text-blue-500 text-sm -tracking-tight transition-colors"
          >
            Events
          </Link>

          {!loading && !user ? (
            <>
              <Link
                href="/login"
                className="text-white px-3 py-2 rounded-sm bg-blue-500 hover:text-blue-500 text-sm -tracking-tight transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-white px-3 py-2 rounded-sm bg-emerald-500 hover:text-blue-500 text-sm -tracking-tight transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative group">
              <div className="w-10 rounded-full h-10 flex justify-center items-center bg-gray-700 text-white cursor-pointer">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    router.push("/login");
                    window.location.reload();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
