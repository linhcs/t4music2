"use client"
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Use `next/navigation` for the app directory
import { useUserStore } from "@/store/useUserStore";

const InactivityTimer = () => {
  const [isClient, setIsClient] = useState(false); // Track if the component is rendered on the client
  const router = useRouter(); // Initialize useRouter hook for redirection
  const inactivityTimeout = 60; // Timeout duration in seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set client flag to true after the component is mounted
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Reset timer on user activity
      const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(handleInactivity, inactivityTimeout * 1000); // Trigger inactivity after timeout
      };

      // Handle inactivity: redirect to login page
      const handleInactivity = () => {
        const store = useUserStore.getState();
        store.logout();
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');

        console.log("User is inactive. Redirecting to login...");
        router.push("/login"); // Redirect to login page (change the path if necessary)
      };
      const events = ["mousemove", "keydown", "click", "scroll"];

      // Attach event listeners for activity tracking
      events.forEach(event => {
        window.addEventListener(event, resetTimer);
      });

      // Start the inactivity timer
      timerRef.current = setTimeout(handleInactivity, inactivityTimeout * 1000);

      // Cleanup event listeners and clear timer on component unmount
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, resetTimer);
        });
        if (timerRef.current){
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isClient, inactivityTimeout, router]); // Only run when the component is mounted on the client

  return null; // Don't display anything on the screen
};

export default InactivityTimer;
