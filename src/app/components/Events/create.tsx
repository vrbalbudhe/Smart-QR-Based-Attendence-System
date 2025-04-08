"use client";
import { useState, useEffect } from "react";
import { MapPin, Calendar } from "lucide-react";
import { useAuth } from "@app/contexts/AuthContext";

export default function CreateEventForm() {
  const { user } = useAuth();

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    name: "",
    from: getCurrentDateTime(),
    to: getCurrentDateTime(),
    venue: "",
    location: { latitude: "", longitude: "" },
    creatorId: "",
  });

  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({ ...prev, creatorId: user.id }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "latitude" || name === "longitude") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.creatorId) {
        alert("User not authenticated. Please log in.");
        return;
      }
      const response = await fetch("/api/event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const result = await response.json();
      console.log("Event Created:", result);
      alert("Event Created Successfully!");
      setFormData({
        name: "",
        from: getCurrentDateTime(),
        to: getCurrentDateTime(),
        venue: "",
        location: { latitude: "", longitude: "" },
        creatorId: user?.id || "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white border border-gray-100 rounded-lg">
      <div className="text-left mb-8">
        <h2 className="text-3xl font-semibold text-gray-700 flex items-center gap-3">
          <Calendar className="text-blue-500" /> Create New Event
        </h2>
        <p className="text-gray-500 text-lg mt-2">
          Fill in the details for your upcoming event
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter event name"
            required
          />
        </div>

        {/* Date and Time */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Venue */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="mr-2 text-blue-600" /> Venue
          </label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter venue name"
            required
          />
        </div>

        {/* Location Coordinates */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.location.latitude}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter latitude"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.location.longitude}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter longitude"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg 
            hover:bg-blue-700 transition-colors duration-300 
            flex items-center justify-center gap-2 
            shadow-md hover:shadow-lg"
          >
            <Calendar className="mr-2" /> Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
