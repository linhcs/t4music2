"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use `next/navigation` for the app directory

const InactivityTimer = () => {
  const [isClient, setIsClient] = useState(false); // Track if the component is rendered on the client
  const router = useRouter(); // Initialize useRouter hook for redirection
  const inactivityTimeout = 60; // Timeout duration in seconds
  let timer: NodeJS.Timeout;

  useEffect(() => {
    // Set client flag to true after the component is mounted
    setIsClient(true);
  }, []);

  // Reset timer on user activity
  const resetTimer = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(handleInactivity, inactivityTimeout * 1000); // Trigger inactivity after timeout
  };

  // Handle inactivity: redirect to login page
  const handleInactivity = () => {
    console.log("User is inactive. Redirecting to login...");
    router.push("/login"); // Redirect to login page (change the path if necessary)
  };

  useEffect(() => {
    if (isClient) {
      const events = ["mousemove", "keydown", "click", "scroll"];

      // Attach event listeners for activity tracking
      events.forEach(event => {
        window.addEventListener(event, resetTimer);
      });

      // Start the inactivity timer
      timer = setTimeout(handleInactivity, inactivityTimeout * 1000);

      // Cleanup event listeners and clear timer on component unmount
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, resetTimer);
        });
        clearTimeout(timer);
      };
    }
  }, [isClient]); // Only run when the component is mounted on the client

  return null; // Don't display anything on the screen
};

export default InactivityTimer;
