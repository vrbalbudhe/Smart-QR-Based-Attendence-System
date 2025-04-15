"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CheckCircle, X, User, Camera, Calendar, Clock } from "lucide-react";

interface AttendanceDetails {
  id: string;
  participantSelfie: string;
  isAttended?: boolean;
}

interface participant {
  id: String;
  email: string;
}

interface Event {
  name: String;
  from: Date;
  to: Date;
}

interface SessionData {
  AttendenceDetails?: AttendanceDetails;
  title?: string;
  Event: Event;
  participant: participant;
  date?: string;
  time?: string;
  duration?: string;
  location?: string;
}

export default function SessionPage() {
  const params = useParams();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/event/session/${params?.sessionid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantId: params?.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch session data");

      const data = await res.json();
      setSessionData(data[0]);
    } catch (error) {
      console.error("Error fetching session data:", error);
      setError("Unable to load session information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, [params?.id, params?.sessionid]);

  const isAttended = sessionData?.AttendenceDetails?.isAttended ?? false;
  const selfieUrl = sessionData?.AttendenceDetails?.participantSelfie;

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm max-w-md">
          <h2 className="text-red-700 text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchSessionData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen mt-20 bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-700">
                {`${sessionData?.Event?.name} [${sessionData?.participant?.email}]` ||
                  "Session Details"}
              </h1>
              <div className="flex items-center mt-2 text-slate-500">
                <span className="bg-slate-100 px-3 py-1 rounded-md text-sm font-mono">
                  {params?.sessionid}
                </span>
              </div>
            </div>
            <div
              className={`px-4 py-2 rounded-lg ${
                isAttended
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              } flex items-center`}
            >
              {isAttended ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <X className="w-5 h-5 mr-2" />
              )}
              <span className="font-medium">
                {isAttended ? "Attended" : "Not Attended"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Session Information */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Session Information
              </h2>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Participant Details
                </h3>
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {sessionData?.participant?.email}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {sessionData?.participant?.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Details */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Attendance
              </h2>

              <div
                className={`p-4 rounded-md ${
                  isAttended ? "bg-emerald-50" : "bg-amber-50"
                } mb-6`}
              >
                <div className="flex items-center">
                  {isAttended ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <X className="w-6 h-6 text-amber-600" />
                  )}
                  <span className="ml-2 font-semibold">
                    {isAttended ? "Attendance Confirmed" : "Not Marked Present"}
                  </span>
                </div>
                <p className="text-sm mt-2 text-gray-600">
                  {isAttended
                    ? "The participant has been marked as present for this session."
                    : "The participant has not been marked as present for this session."}
                </p>
              </div>

              {selfieUrl && (
                <div>
                  <div className="flex items-center mb-3">
                    <Camera className="w-5 h-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">
                      Participant Selfie
                    </h3>
                  </div>
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selfieUrl}
                      alt="Participant Selfie"
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-profile.png";
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selfie captured for attendance verification
                  </p>
                </div>
              )}

              {!selfieUrl && isAttended && (
                <div className="text-center py-4">
                  <p className="text-gray-500">No selfie available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
