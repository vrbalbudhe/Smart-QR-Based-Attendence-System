"use client";

import { useAuth } from "@app/contexts/AuthContext";
import React, { useEffect, useState } from "react";
import EventCardDS from "./EventCardDS";

interface Event {
  id: string;
  name: string;
  from: string;
  to: string;
  venue?: string;
}

export default function OtherEventCard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/event/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id]);

  if (loading)
    return <p className="text-center text-gray-500">Loading events...</p>;
  if (events.length === 0)
    return <p className="text-center text-gray-500">No events found.</p>;

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full min-h-10 flex justify-start items-center">
        <p className="text-xl font-semibold ml-2 tracking-tight text-gray-700">
          Explore Other Events
        </p>
      </div>
      <div className="flex gap-5">
        {events.map((event, index) => (
          <EventCardDS
            key={index}
            id={event.id}
            name={event.name}
            venue={event.venue || "NA"}
            from={event.from}
            to={event.to}
            addQrCode={""}
            participants={[]}
            EventSession={[]}
          />
        ))}
      </div>
    </div>
  );
}
