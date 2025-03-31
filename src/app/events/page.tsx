import MyEvents from "@app/components/Events/myEvents";
import React from "react";

export default function page() {
  return (
    <div className="w-[95%] min-h-screen pt-40">
      {/* My Events */}
      <div>
        <MyEvents />
      </div>
      {/* Other Events */}
      <div></div>
    </div>
  );
}
