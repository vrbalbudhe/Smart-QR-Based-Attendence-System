import React from "react";
import EventCard from "./EventCard";
import OtherEventCard from "./OtherEventCard";

export default function MyEvents() {
  return (
    <div className="w-full h-full flex flex-col pb-20">
      <div className="flex flex-col gap-20">
        <EventCard />
        {/* <OtherEventCard /> */}
      </div>
    </div>
  );
}
