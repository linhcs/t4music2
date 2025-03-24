import { create } from "zustand";
import { persist } from "zustand/middleware";

interface userState {
  username: string;
  user_id: number;
  setUser: (username: string, user_id: number) => void;
  clearUser: () => void;
}

export const useUserStore = create<userState>()(
  persist(
    (set) => ({
      username: "",
      user_id: 0,
      setUser: (username, user_id) => set({ username, user_id }),
      clearUser: () => set({ user_id: 0, username: "" }),
    }),
    { name: "user-storage" }
  )
);
