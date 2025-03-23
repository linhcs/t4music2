import { create } from "zustand";
import { persist } from "zustand/middleware";

interface userState {
  email: string;
  username: string;
  setUser: (email: string, username: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<userState>()(
  persist(
    (set) => ({
      email: "",
      username: "",
      setUser: (email, username) => set({ email, username }),
      clearUser: () => set({ email: "", username: "" }),
    }),
    { name: "user-storage" }
  )
);
