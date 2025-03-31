"use client";
import { useState } from "react";
import { QrCodeIcon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClientActionButtons() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateEvent = () => {
    setIsLoading(true);
    router.push("/create");
  };

  const handleScanQR = () => {
    setIsLoading(true);
    router.push("/qr-scanner");
  };

  return (
    <div className="flex justify-center space-x-2 my-10">
      <button
        onClick={handleCreateEvent}
        disabled={isLoading}
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-sm 
                   hover:bg-blue-700 transition-colors shadow-md 
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusCircleIcon className="mr-2" />
        Create Event
      </button>
      <button
        onClick={handleScanQR}
        disabled={isLoading}
        className="flex items-center bg-emerald-400 text-white px-4 text-md py-2 rounded-sm 
                   hover:bg-green-700 transition-colors shadow-md
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <QrCodeIcon className="mr-2" />
        Scan QR Code
      </button>
    </div>
  );
}
