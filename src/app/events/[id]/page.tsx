"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  Share2,
  QrCode,
  UserCheck,
} from "lucide-react";
import EventSessionCard from "@app/components/Events/ParticipantsCard";

interface EventCardProps {
  id: string;
  name: string;
  venue: string;
  from: string;
  to: string;
  addQrCode: string;
  attendenceQrCode: string;
  participants: string[];
  EventSession: {
    id: string;
    attendenceDetailsId: string;
    participant?: {
      id: string;
      name?: string;
    };
    participantId?: string;
    eventId?: string;
  }[];
}

interface EventSessionCardProps {
  id: string;
  attendenceDetailsId: string;
  attendenceDetails: {
    id: string;
    isAttended: boolean;
    participantSelfie: string;
    locationDetailsId: string;
    locationDetails: {
      id: string;
      location?: string;
    };
  };
  participant?: {
    id: string;
    name?: string;
    // Add other participant properties as needed
  };
  participantId?: string;
  event?: {
    id: string;
    name: string;
    venue: string;
    from: string;
    to: string;
    addQrCode: string;
    attendenceQrCode: string;
    participants: string[];
    EventSession: any[];
    // Other event properties
  };
  eventId?: string;
}

export default function Page() {
  const params = useParams();
  const [event, setEvent] = useState<EventCardProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/event/get/${params?.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }
        const data: EventCardProps = await response.json();
        console.log(data);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEventDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-t-blue-600 border-blue-100 rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium text-lg">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Return to Events
          </button>
        </div>
      </div>
    );
  }

  const formattedEventName = event.name.toUpperCase();
  const registeredCount = event?.EventSession?.length || 0;
  const attendedCount = event?.EventSession?.length || 0;

  return (
    <div className="min-h-screen w-full py-12 mt-24 px-4 sm:px-6 lg:px-8">
      <div className=" w-full mx-auto">
        <div className="mb-6">
          <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Events
          </button>
        </div>

        <div className="bg-white w-full border border-gray-100 overflow-hidden">
          <div className="relative h-20 sm:h-28">
            <div className="absolute inset-0 bg-opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-12">
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-700 tracking-tight">
                {formattedEventName}
              </h1>
              <div className="flex space-x-3">
                <button className="p-3 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div className="bg-gray-50 px-8 sm:px-12 py-4 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Event Active
              </span>
            </div>
            <div className="flex items-center">
              <button
                className={`text-md rounded-lg select-none px-6 py-2.5 font-medium text-white transition-colors ${!event.attendenceQrCode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 hover:bg-gray-600"}`}
                onClick={(e) => e.preventDefault()}
              >
                {!event.attendenceQrCode ? (
                  <span className="flex items-center">
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate Attendance QR
                  </span>
                ) : (
                  <span className="flex items-center">
                    <QrCode className="h-4 w-4 mr-2" />
                    AQC Generated
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-8 sm:px-12 pt-6 border-b border-gray-100">
            <div className="flex space-x-8">
              <button
                className={`pb-4 font-medium text-base transition-colors ${activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                onClick={() => setActiveTab("details")}
              >
                Event Details
              </button>
              <button
                className={`pb-4 font-medium text-base transition-colors ${activeTab === "participants" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                onClick={() => setActiveTab("participants")}
              >
                Participants
              </button>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Left column - Event info */}
              <div className="md:col-span-2 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                          VENUE
                        </h3>
                        <p className="text-gray-800 font-medium text-lg mt-1">
                          {event.venue}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <Calendar className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                          DATE & TIME
                        </h3>
                        <p className="text-gray-800 font-medium text-lg mt-1">
                          {event.from} - {event.to}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">
                          Registered
                        </p>
                        <p className="text-4xl font-bold mt-2">
                          {registeredCount}
                        </p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">
                          Attended
                        </p>
                        <p className="text-4xl font-bold mt-2">
                          {attendedCount}
                        </p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                        <UserCheck className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - QR code */}
              <div className="flex flex-col items-center">
                <div className="bg-white p-6 border border-gray-100 w-full max-w-xs">
                  <div className="text-left">
                    <h3 className="text-2xl font-medium text-gray-700">
                      Event Registration
                    </h3>
                    <p className="text-gray-500 text-sm">Scan to join</p>
                  </div>
                  <div className="">
                    <img
                      src={event.addQrCode}
                      alt="Event QR Code"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full pl-14 pr-14 min-h-screen">
            <div className="text-left mb-4">
              <h3 className="text-4xl font-medium text-gray-700">
                Participants
              </h3>
              <p className="text-gray-500 text-sm">Scroll to view</p>
            </div>
            {event.EventSession.map((session, index) => (
              <EventSessionCard
                key={session.id || index}
                id={session.id || `session-${index}`}
                // Don't pass attendenceDetails directly since it's undefined
                // Instead, fetch it or modify your API to include it
                attendenceDetailsId={session.attendenceDetailsId}
                // Create a default or fetch the actual data
                attendenceDetails={{
                  id: session.attendenceDetailsId || "",
                  isAttended: false, // Default value
                  participantSelfie: "", // Default value
                  locationDetailsId: "",
                  locationDetails: { id: "", location: "" },
                }}
                participant={session.participant}
                participantId={session.participantId}
                event={event}
                eventId={session.eventId}
              />
            ))}
          </div>

          <div className="bg-gray-800 px-8 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-400">Created on March 31, 2025</p>
            <p className="text-sm text-white font-mono">EID: {event.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
