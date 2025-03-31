"use client";

import { useAuth } from "@app/contexts/AuthContext";
import { useState } from "react";
import QRCodeViewer from "./QRCodeViewer";
import { useRouter } from "next/navigation";

interface EventCardProps {
  id: string;
  name: string;
  venue: string;
  from: string;
  to: string;
  addQrCode: string;
  participants: string[];
  EventSession: string[];
}

export default function EventCardDS({
  id,
  name,
  venue,
  from,
  to,
  addQrCode,
  participants,
  EventSession,
}: EventCardProps) {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        `/api/event/generateQr/addToEvent?eventId=${id}&participantId=${user?.id}&token=${process.env.NEXT_PUBLIC_QR_SECRET_KEY}`
      );
      const data = await response.json();
      setQrCode(data.qrCode);
      if (response.ok) {
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Error generating QR code", error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-[400px] hover:scale-105 transition-all duration-300 flex flex-col gap-5 shadow-sm p-5 rounded-lg border border-gray-200">
      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-blue-500 font-semibold">
            {name.toUpperCase()}
          </h2>
          <div
            onClick={() => router.push(`/events/${id}`)}
            className="cursor-pointer"
          >
            <p className="text-sm text-gray-700 font-medium">More Info</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">{venue || "N/A"}</p>
      </div>
      {!addQrCode && (
        <div className="flex gap-2">
          <button
            onClick={generateQRCode}
            disabled={isGenerating}
            className="px-2 py-1.5 cursor-pointer hover:bg-blue-500 hover:border-blue-500 border shadow-sm border-gray-200 hover:text-white text-gray-700 rounded-md bg-white text-sm disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate QR"}
          </button>
        </div>
      )}
      {addQrCode && <QRCodeViewer qrImagePath={addQrCode} />}
      <div className="pl-5 pr-5 bg-blue-500 flex justify-between items-center h-14 rounded-md shadow-xs border-none">
        <p className="text-white text-md">Participants</p>
        <p className="text-gray-300 text-md">
          <span className="px-1 mr-2 bg-blue-300 rounded-full"></span>
          <span className="mr-2 text-white">{EventSession?.length || 0}</span>
          Registered
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          From: {new Date(from).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">
          To: {new Date(to).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
