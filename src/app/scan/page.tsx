"use client";

import { useSearchParams } from "next/navigation";

export default function ScanSuccess() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        {status === "success" ? (
          <>
            <h1 className="text-2xl font-bold text-green-600">
              ✅ Registration Successful!
            </h1>
            <p className="mt-2 text-gray-600">
              You have been successfully registered for the event.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-yellow-500">
              ⚠️ Already Registered
            </h1>
            <p className="mt-2 text-gray-600">
              You are already registered for this event.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
