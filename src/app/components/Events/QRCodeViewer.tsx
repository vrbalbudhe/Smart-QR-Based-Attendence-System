import { useState, useEffect } from "react";

interface QRIMGSTRING {
  qrImagePath: string;
}

export default function QRCodeViewer({ qrImagePath }: QRIMGSTRING) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 border border-blue-200 text-sm text-gray-700 rounded-lg"
      >
        View QR Code
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-xs sm:max-w-md">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 rounded-full p-2 transition"
            >
              ✖
            </button>
            <img
              src={qrImagePath}
              alt="QR Code"
              className="w-full max-w-[250px] mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
