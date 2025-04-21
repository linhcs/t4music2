"use client";

import { useState } from "react";
import { FaQuestionCircle, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useUserStore } from "@/store/useUserStore";

export default function SupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user_id } = useUserStore();

  // Don't render anything if user is not logged in
  if (!user_id) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user_id) return;

    setIsSubmitting(true);
    try {
      const ticketData = {
        type: "support_ticket",
        title,
        description,
        priority,
        category,
        metadata: {
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
        },
      };

      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          message: JSON.stringify(ticketData),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit ticket");
      }

      // Reset form and close
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("general");
      setIsOpen(false);
      alert("Support ticket submitted successfully!");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Failed to submit support ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
        title="Get Support"
      >
        <FaQuestionCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">Submit Support Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 h-32"
                  required
                  maxLength={500}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  >
                    <option value="general">General</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="account">Account Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <FaPaperPlane />
                    Submit Ticket
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
