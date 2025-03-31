import React from "react";

interface Participants {
  id: string;
  name?: string; // Adding a common field for display
}

interface Event {
  id: string;
  name?: string; // Adding a common field for display
}

interface LocationDetails {
  id: string;
  location?: string; // Assuming location has a descriptive field
}

interface AttendenceDetails {
  id: string;
  isAttended: boolean;
  participantSelfie: string;
  locationDetailsId: string;
  locationDetails: LocationDetails;
}

interface EventSessionProps {
  id: string;
  attendenceDetailsId: string;
  attendenceDetails: AttendenceDetails;
  participant?: Participants;
  participantId?: string;
  event?: Event;
  eventId?: string;
}

export default function EventSessionCard({
  id,
  attendenceDetails,
  participant,
  event,
}: EventSessionProps) {
  const attendanceStatus = attendenceDetails.isAttended
    ? "Attended"
    : "Not Attended";

  return (
    <div className="rounded-lg border border-gray-300 shadow-sm p-4 w-full">
      <div className="flex items-center gap-4">
        {/* Participant Selfie */}
        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
          {attendenceDetails.participantSelfie && (
            <img
              src={attendenceDetails.participantSelfie}
              alt="Participant Selfie"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-700 text-lg">
            {participant?.name || "Unnamed Participant"}
          </h3>
          <p className="text-gray-600">{event?.name || "Unnamed Event"}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            attendenceDetails.isAttended
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {attendanceStatus}
        </div>
      </div>
    </div>
  );
}
