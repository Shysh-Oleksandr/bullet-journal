"use client";

import { create } from "zustand";

import { auth } from "@/lib/firebase";
import { queryClient } from "@/lib/queryClient";
import { signOut } from "firebase/auth";

import type { ShortUser } from "./types";
import type User from "./types";

const USER_STORAGE_KEY = "user";

interface AuthState {
  user: User | null;
  userId: string;
  /** True after initAuth has run (client-side); use to avoid showing unauthenticated UI before we've restored from localStorage */
  authChecked: boolean;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userId: "",
  authChecked: false,

  initAuth: async () => {
    if (typeof window === "undefined") return;
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const user = storedUser ? (JSON.parse(storedUser) as User) : null;

      if (user?.access_token) {
        set({ user, userId: user._id ?? "", authChecked: true });
      } else {
        if (auth) await signOut(auth);
        set({ user: null, userId: "", authChecked: true });
        queryClient.removeQueries();
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      set({ authChecked: true });
    }
  },

  setUser: (user: User) => {
    const shortUser: ShortUser = {
      _id: user._id,
      uid: user.uid,
      name: user.name,
      access_token: user.access_token,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(shortUser));
    set({ user, userId: user._id ?? "" });
  },

  logout: async () => {
    try {
      if (auth) await signOut(auth);
      localStorage.removeItem(USER_STORAGE_KEY);
      set({ user: null, userId: "" });
      queryClient.removeQueries();
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
}));

export const initializeAuth = () => {
  useAuthStore.getState().initAuth();
};
