"use client";

import { useState } from "react";
import { Switch } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "@/components/ui/NavBar";
import { useUserStore } from "@/store/useUserStore";

function SaveSuccessModal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="neon-card flex flex-col items-center w-full max-w-sm p-6 rounded-2xl shadow-2xl space-y-4 border-4 border-black animate-gradient">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          {message}
        </h2>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2 text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-lg hover:scale-105 transition-all duration-200 glow-button"
        >
          🎵 Keep Groovin’ 🎵
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const store = useUserStore.getState();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Edit‑profile modal state
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(store.username);
  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // success popup state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogout = () => {
    store.logout();
    localStorage.removeItem("user-storage");
    document.cookie = "user_id=; Max-Age=0; path=/;";
    router.push("/login");
  };

  const handleSaveUsername = async () => {
    setEditError(null);
    if (newUsername.trim().length < 3) {
      setEditError("Must be at least 3 characters.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: newUsername }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update.");
      }

      store.setUser(data.username, store.role, store.pfp, store.user_id);
      setEditMode(false);

      setSuccessMessage(`Username updated to ${data.username}! 🎶`);
      setShowSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setEditError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Account Settings */}
        <div className="p-4 bg-gray-800 rounded-2xl shadow-2xl border-4 border-black animate-gradient">
          <h2 className="text-2xl font-semibold mb-2">Account Settings</h2>
          <p className="text-gray-400 mb-4">Change your public username.</p>

          {editMode ? (
            <div className="space-y-3">
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none"
                placeholder="New username"
                disabled={saving}
              />
              {editError && <p className="text-red-500 text-sm">{editError}</p>}
              <div className="flex gap-4">
                <button
                  onClick={handleSaveUsername}
                  disabled={saving}
                  className="px-4 py-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-lg shadow hover:opacity-90 transition flex-1 text-center"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setNewUsername(store.username);
                    setEditError(null);
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-700 rounded-lg shadow hover:opacity-90 transition flex-1 text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow hover:opacity-90 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Notifications Section */}
        <div className="p-4 bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Notifications</h2>
            <p className="text-gray-400 text-sm">
              Toggle notifications on or off.
            </p>
          </div>
          <Switch
            checked={notificationsEnabled}
            onChange={setNotificationsEnabled}
            className={`${
              notificationsEnabled ? "bg-blue-600" : "bg-gray-500"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Enable notifications</span>
            <span
              className={`${
                notificationsEnabled ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {/* Privacy Section */}
        <div className="p-4 bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700">
          <h2 className="text-2xl font-semibold mb-2">Privacy</h2>
          <p className="text-gray-400">
            Control who can see your activity and personal information.
          </p>
          <div className="mt-4">
            <Link
              href="/Privacy"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow hover:opacity-90 transition"
            >
              Privacy Settings
            </Link>
          </div>
        </div>

        {/* Logout Section */}
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 rounded-2xl shadow-2xl hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {showSuccess && (
        <SaveSuccessModal
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
