"use client";

import { useEffect } from "react";

import { initializeAuth } from "@/lib/auth/store";

export function AuthInit() {
  useEffect(() => {
    initializeAuth();
  }, []);
  return null;
}
