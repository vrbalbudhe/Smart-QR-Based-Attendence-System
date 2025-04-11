"use client";
import { useEffect, useState } from "react";
import { CheckCircle, MapPin, Loader } from "lucide-react";
import { useParams } from "next/navigation";
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

export default function MarkAttendance() {
  const [locationDetails, setLocationDetails] = useState<{
    display: string;
    area?: string;
    city?: string;
    state?: string;
    country?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [isRegistered, setIsRegistered] = useState<null | boolean>(null);
  const [event, setEvent] = useState<EventCardProps | null>(null);

  const params = useParams();
  const { user } = useAuth();
  const eventId = params?.id as string;
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationDetails({ display: "Geolocation not supported." });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://us1.locationiq.com/v1/reverse.php?key=pk.172cef7453a6d5867cfb00259baf81ed&lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const { address, display_name } = data;

          setLocationDetails({
            display: display_name,
            area: address.suburb || address.neighbourhood || address.village,
            city: address.city || address.town || address.county,
            state: address.state,
            country: address.country,
          });
        } catch (err) {
          setLocationDetails({ display: "Unable to retrieve address." });
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLocationDetails({ display: "Unable to retrieve your location." });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const checkRegistration = async () => {
    if (!user || !eventId) return;

    try {
      const res = await fetch("/api/event/attendence/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?.id, eventId }),
      });

      const data = await res.json();
      console.log(data);
      setIsRegistered(data.registered);
    } catch (err) {
      setIsRegistered(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!user || !eventId || !locationDetails?.display) return;

    try {
      const res = await fetch("/api/event/attendence/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          eventId: eventId,
          location: locationDetails.display,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAttendanceMarked(true);
        alert("Attendance marked successfully!");
      } else {
        alert(data.message || "Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Something went wrong while marking attendance.");
    }
  };

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

  const from = event?.from ? Date.parse(event.from) : 0;
  const to = event?.to ? Date.parse(event.to) : 0;
  const now = Date.now();

  const isActive = now >= from && now <= to;

  useEffect(() => {
    if (user && eventId) {
      getLocation();
      checkRegistration();
    }
  }, [user, eventId]);

  return (
    <div className="min-h-screen w-full mt-20 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white overflow-hidden">
          <div className="bg-gray-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Mark Attendance</h1>
                <p className="text-gray-200 mt-1">
                  Accurate location will be used to confirm your presence
                </p>
              </div>
              <MapPin size={40} className="text-white opacity-80" />
            </div>
          </div>

          <div className="p-6">
            <div className="bg-green-50 p-5 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                Location Details
              </h3>
              {loading ? (
                <div className="flex items-center text-gray-600 text-sm">
                  <Loader size={18} className="animate-spin mr-2" />
                  Retrieving high-accuracy location...
                </div>
              ) : locationDetails ? (
                <div className="text-gray-700 text-sm space-y-1">
                  <p>{locationDetails.display}</p>
                  {locationDetails.area && <p>Area: {locationDetails.area}</p>}
                  {locationDetails.city && <p>City: {locationDetails.city}</p>}
                  {locationDetails.state && (
                    <p>State: {locationDetails.state}</p>
                  )}
                  {locationDetails.country && (
                    <p>Country: {locationDetails.country}</p>
                  )}
                </div>
              ) : (
                <p className="text-red-500 text-sm">Unable to fetch location</p>
              )}
            </div>

            <div
              className={`${isRegistered ? "bg-emerald-300" : "bg-red-300"} p-5 rounded-md mb-6`}
            >
              <h3 className="text-lg font-semibold text-gray-100 mb-3">
                Event Registration Check
              </h3>
              {isRegistered === null ? (
                <div className="flex items-center text-gray-600 text-sm">
                  <Loader size={18} className="animate-spin mr-2" />
                  Checking registration status...
                </div>
              ) : isRegistered ? (
                <p className="text-gray-700 text-md font-semibold">
                  User is registered for this event.
                </p>
              ) : (
                <p className="text-red-600 text-sm">
                  User is not registered for this event.
                </p>
              )}
            </div>

            {isRegistered && isActive ? (
              <div className="flex justify-start">
                <button
                  onClick={handleMarkAttendance}
                  disabled={
                    attendanceMarked ||
                    loading ||
                    !locationDetails ||
                    !isRegistered
                  }
                  className="px-6 py-3 bg-emerald-400 hover:bg-emerald-500 text-white rounded-md shadow-md flex items-center transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                >
                  <CheckCircle size={20} className="mr-2" />
                  {attendanceMarked ? "Attendance Marked" : "Mark Attendance"}
                </button>
              </div>
            ) : (
              <div
                className={`${isActive ? "bg-emerald-300" : "bg-red-300"} p-5 rounded-md`}
              >
                <h3 className="text-lg font-semibold text-gray-100 mb-3">
                  Event Activation Check
                </h3>
                {isActive === null ? (
                  <div className="flex items-center text-gray-600 text-sm">
                    <Loader size={18} className="animate-spin mr-2" />
                    Checking registration status...
                  </div>
                ) : isActive ? (
                  <p className="text-white text-md">
                    Event Is ON!!
                  </p>
                ) : (
                  <p className="text-white text-md">Event Ended!</p>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Having trouble? Contact event support at support@event.com
        </p>
      </div>
    </div>
  );
}
