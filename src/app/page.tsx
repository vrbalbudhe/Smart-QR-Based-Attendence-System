import { Suspense } from "react";
import ClientActionButtons from "./components/Homepage/ClientActionButtons";
import ActionButtonsFallback from "./components/Homepage/ActionButtonsFallback";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white relative">
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-90 
        bg-[size:400px_400px] bg-opacity-50 
        [background-image:radial-gradient(rgb(255,255,255,0.1)_1px,transparent_1px)]"
      ></div>
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <WelcomeMessage />

          <Suspense fallback={<ActionButtonsFallback />}>
            <ClientActionButtons />
          </Suspense>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

const WelcomeMessage: React.FC<{}> = () => {
  return (
    <div className="text-center my-12 px-4">
      <h1 className="text-6xl tracking-tighter font-normal text-gray-700 mb-4">
        Welcome to Event Check-In
      </h1>
      <p className="text-md font-normal text-gray-800 max-w-5xl mx-auto">
        Streamline your event management with our smart QR code-based check-in
        system. Easily track attendees, manage events, and improve your event
        experience with just a few clicks.
      </p>
    </div>
  );
};
