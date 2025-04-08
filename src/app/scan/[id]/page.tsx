"use client";
import { useAuth } from "@app/contexts/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ScanSuccess() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const participantId = user?.id || null;
  const [eventId, setEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const parts = pathname.split("/");
    const id = parts[parts.length - 1];
    setEventId(id);
  }, [pathname]);

  const handleAction = async (action: "accept" | "reject") => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(
        `/api/scan?eventId=${eventId}&participantId=${participantId}&action=${action}`,
        { method: "POST" }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setMessage(
          action === "accept"
            ? "✅ Registration Successful! Welcome to the event."
            : "❌ Invitation Rejected!"
        );
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setMessage(data.error || "Something went wrong!");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-lg shadow-sm text-center">
        {message ? (
          <h1 className="text-xl font-bold text-blue-600">{message}</h1>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              🎉 Event Invitation
            </h1>
            <p className="mb-4 text-lg text-gray-600">
              You have been invited to an event.
            </p>
            <div className="my-4 bg-gray-100 p-3 rounded text-left">
              <p className="text-sm text-gray-600">
                Participant ID: {participantId}
              </p>
              <p className="text-sm text-gray-600">Event ID: {eventId}</p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => handleAction("accept")}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "✅ Accept"}
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={loading}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "❌ Reject"}
              </button>
            </div>
            <p className="mt-5 text-sm text-red-500 font-medium">
              Note: You must be logged in before accepting the invitation
            </p>
          </>
        )}
      </div>
    </div>
  );
}
