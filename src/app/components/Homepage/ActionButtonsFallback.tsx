import { PlusCircleIcon, QrCodeIcon } from "lucide-react";

export default function ActionButtonsFallback() {
  return (
    <div className="flex justify-center space-x-6 my-10">
      <div className="animate-pulse flex items-center bg-blue-300 text-white px-6 py-3 rounded-lg">
        <PlusCircleIcon className="mr-2" />
        Create Event
      </div>
      <div className="animate-pulse flex items-center bg-green-300 text-white px-6 py-3 rounded-lg">
        <QrCodeIcon className="mr-2" />
        Scan QR Code
      </div>
    </div>
  );
}
