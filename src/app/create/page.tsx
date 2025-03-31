import CreateEventForm from "@app/components/Events/create";
import React from "react";

export default function page() {
  return (
    <div className="w-full min-h-screen pt-20 pb-20 flex flex-col">
      <div className="w-full flex h-full justify-center items-start gap-10">
        <div className="w-[40%] h-full">
          <CreateEventForm />
        </div>
        <div className="w-[50%] h-full pointer-events-none select-none flex justify-center items-center">
          <img
            className=" object-cover rounded-xl"
            src="https://img.freepik.com/free-vector/conference-concept-illustration_114360-24472.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
