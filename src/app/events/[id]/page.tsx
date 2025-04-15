"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Share2,
  QrCode,
  UserCheck,
  Users2,
  Link,
  ArrowLeft,
  Clipboard,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@app/contexts/AuthContext";
interface EventCardProps {
  id: string;
  name: string;
  venue: string;
  from: string;
  to: string;
  creatorId: string;
  addQrCode: string;
  attendenceQrCode: string;
  participants: string[];
  EventSession: {
    id: string;
    attendenceDetailsId: string;
    participant?: {
      id: string;
      name?: string;
      email?: string;
    };
    AttendenceDetails: {
      id: string;
      isAttended: boolean;
      participantSelfie: string;
      locationDetailsId: string;
      locationDetails: {
        id: string;
        location?: string;
      };
    };
    participantId?: string;
    eventId?: string;
  }[];
}

interface EventSessionCardProps {
  id: string;
  attendenceDetailsId: string;
  AttendenceDetails: {
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
    email?: string;
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
  };
  eventId?: string;
}
export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventCardProps | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(!!event?.attendenceQrCode);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/event/get/${params?.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }
        const data: EventCardProps = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params?.id) {
      fetchEventDetails();
    }
  }, []);

  const handleGenerateQR = async () => {
    if (qrGenerated || loading) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/event/generateQr/attendenceQr/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: params?.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setQrGenerated(true);
      } else {
        alert(data.error || "Failed to generate QR");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const eventId = (params?.id as string) ?? "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="p-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/events")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Return to Events
          </button>
        </div>
      </div>
    );
  }

  const formattedEventName = event.name.toUpperCase();
  const registeredCount = event?.EventSession?.length || 0;
  const attendedCount =
    event?.EventSession?.filter(
      (session) => session.AttendenceDetails.isAttended == true
    ).length || 0;

  const from = event?.from ? Date.parse(event.from) : 0;
  const to = event?.to ? Date.parse(event.to) : 0;
  const now = Date.now();

  const isActive = now >= from && now <= to;
  const downloadAttendanceExcel = async (eventId: string) => {
    const res = await fetch(`/api/event/export/${eventId}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to generate or download Excel");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `event-${eventId}-attendance.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const registrationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/scan/${params?.id}`;
  const attendenceLink = `${process.env.NEXT_PUBLIC_BASE_URL}/confirmAttendence/${params?.id}`;
  return (
    <div className="min-h-screen w-full mt-14">
      <div className="bg-white w-full">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/events")}
                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium">Back to Events</span>
              </button>
            </div>
            <div>
              <button className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm overflow-hidden">
          {/* Event Header Banner */}
          <div className="relative h-32 flex items-end">
            <div className="absolute inset-0 bg-opacity-10 pattern-dots pattern-blue-500 pattern-bg-white pattern-size-4 pattern-opacity-20"></div>
            <div className="px-8 py-6 w-full">
              <h1 className="text-3xl font-semibold text-gray-700 tracking-tight">
                {formattedEventName}
              </h1>
              <div className="mt-2 flex items-center">
                <div
                  className={`h-5 w-5 rounded-full mr-2 ${
                    isActive ? "bg-green-400 animate-pulse" : "bg-red-400"
                  }`}
                ></div>
                <span className="text-sm font-medium text-gray-600">
                  {isActive ? "Active Event" : "Closed Event"}
                </span>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="border-b border-gray-200">
            <div className="px-8">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "details"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Event Details
                </button>
                <button
                  onClick={() => setActiveTab("participants")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "participants"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Participants
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          {activeTab === "details" ? (
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column - Event info */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Event Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Venue Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Venue
                          </h3>
                          <p className="text-gray-800 font-medium mt-1">
                            {event.venue}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <Calendar className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </h3>
                          <p className="text-gray-800 font-medium mt-1">
                            {event.from} - {event.to}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration Link */}
                  <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <Link className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                          Event Registration Link
                        </h3>
                        <div className="mt-2 flex items-center">
                          <input
                            type="text"
                            value={registrationLink}
                            readOnly
                            className="flex-grow bg-gray-50 py-2 px-3 rounded text-sm text-gray-700 border border-gray-200"
                          />
                          <button
                            onClick={() => copyToClipboard(registrationLink)}
                            className="ml-2 p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                            title="Copy to clipboard"
                          >
                            {copied ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Clipboard className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <Link className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                          Event Attendence Link
                        </h3>
                        <div className="mt-2 flex items-center">
                          <input
                            type="text"
                            value={attendenceLink}
                            readOnly
                            className="flex-grow bg-gray-50 py-2 px-3 rounded text-sm text-gray-700 border border-gray-200"
                          />
                          <button
                            onClick={() => copyToClipboard(attendenceLink)}
                            className="ml-2 p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                            title="Copy to clipboard"
                          >
                            {copied ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Clipboard className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {user?.id === event?.creatorId && (
                    <button
                      onClick={() =>
                        params?.id && downloadAttendanceExcel(eventId)
                      }
                      className="bg-blue-500 ml-5 mt-5 text-white px-4 py-2 rounded"
                    >
                      Download Attendance
                    </button>
                  )}
                </div>

                {/* Right column - Stats & QR */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Event Statistics
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-100">
                      {/* Registered Stats */}
                      <div className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-full mb-4">
                          <Users2 className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-800">
                          {registeredCount}
                        </div>
                        <div className="text-sm font-medium text-gray-500 mt-1">
                          Participants
                        </div>
                      </div>

                      {/* Attended Stats */}
                      <div className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-full mb-4">
                          <UserCheck className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-800">
                          {attendedCount}
                        </div>
                        <div className="text-sm font-medium text-gray-500 mt-1">
                          Attended
                        </div>
                      </div>
                    </div>
                    {event?.addQrCode && (
                      <div className="p-6 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Registration QR
                        </h3>
                        <div className="bg-white p-2 border border-gray-200 rounded-lg inline-block">
                          <img
                            src={event?.addQrCode}
                            alt="Event QR Code"
                            className="h-48 w-48 object-contain"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex w-full">
                      {event?.attendenceQrCode && (
                        <div className="p-6 border-t border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Attendence QR-Code
                          </h3>
                          <div className="bg-white p-2 border border-gray-200 rounded-lg inline-block">
                            <img
                              src={event?.attendenceQrCode}
                              alt="Event QR Code"
                              className="h-48 w-48 object-contain"
                            />
                          </div>
                        </div>
                      )}
                      {!event?.attendenceQrCode &&
                        user?.id === event?.creatorId && (
                          <div className="p-6 border-t border-gray-100">
                            <button
                              className={`w-full rounded-lg py-3 px-4 font-medium text-white transition-colors ${
                                !qrGenerated
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : "bg-gray-500"
                              }`}
                              onClick={handleGenerateQR}
                              disabled={
                                qrGenerated ||
                                !!event?.attendenceQrCode ||
                                loading
                              }
                            >
                              <span className="flex items-center justify-center">
                                <QrCode className="h-4 w-4 mr-2" />
                                {qrGenerated || event?.attendenceQrCode
                                  ? "AQC Generated"
                                  : loading
                                    ? "Generating..."
                                    : "Generate Attendance QR"}
                              </span>
                            </button>
                          </div>
                        )}{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Participants List
                </h2>
                <div className="text-sm text-gray-500">
                  Total: <span className="font-medium">{registeredCount}</span>
                </div>
              </div>

              {/* Participants Table */}
              <div className="bg-white overflow-hidden border border-gray-200 sm:rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Session ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        TimeStamps
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {event?.EventSession?.map((session, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td
                          onClick={() =>
                            router.push(`/events/${params?.id}/${session?.id}`)
                          }
                          className="px-6 py-4 whitespace-nowrap text-sm hover:text-blue-600 hover:underline cursor-pointer select-none font-medium text-gray-900"
                        >
                          {session.id.slice(20, 25)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm hover:text-blue-600 hover:underline cursor-pointer select-none font-medium text-gray-900">
                          {session?.participantId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap -tracking-tight text-sm text-gray-700">
                          {session?.participant?.email || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${session?.AttendenceDetails?.isAttended ? "bg-green-200 text-emerald-800" : "bg-red-200 text-red-400"}`}
                          >
                            {session?.AttendenceDetails?.isAttended ? (
                              <p>Attended</p>
                            ) : (
                              <p className="">Registered</p>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap -tracking-tight text-sm text-gray-700">
                          <p className="text-center">- -</p>
                        </td>
                      </tr>
                    ))}
                    {event.EventSession.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-sm text-gray-500"
                        >
                          No participants have registered for this event yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
