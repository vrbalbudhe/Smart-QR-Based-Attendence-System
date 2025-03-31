import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#30343f] backdrop-blur-md text-white">
      <div className="w-[90%] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Event Check-In</h3>
            <p className="text-white/80 text-sm">
              Revolutionizing event management with smart QR code technology.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link
                href="/events"
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                Events
              </Link>
              <Link
                href="/admin/create-event"
                className="block text-white/80 hover:text-white transition-colors text-sm"
              >
                Create Event
              </Link>
              <Link
                href="/qr-scanner"
                className="block text-white/80 hover:text-white transition-colors text-sm"
              >
                QR Scanner
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <nav className="space-y-2">
              <Link
                href="/help"
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                Help Center
              </Link>
              <Link
                href="/contact"
                className="block text-white/80 hover:text-white transition-colors text-sm"
              >
                Contact Us
              </Link>
              <Link
                href="/faq"
                className="block text-white/80 hover:text-white transition-colors text-sm"
              >
                FAQ
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Facebook size={24} />
              </Link>
              <Link
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Twitter size={24} />
              </Link>
              <Link
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </Link>
              <Link
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Linkedin size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Event Check-In. All Rights Reserved.
          </p>
          <div className="mt-2 space-x-4">
            <Link
              href="/privacy"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
