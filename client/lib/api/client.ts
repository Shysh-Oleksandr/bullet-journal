import axios, { AxiosInstance } from "axios";

import { appConfig } from "@/lib/config";

export const client = axios.create({
  baseURL: `${appConfig.apiBaseUrl}/api`,
});

const applyAuthorizationInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      if (typeof window === "undefined") return config;
      try {
        const storedUserJSON = localStorage.getItem("user");
        if (storedUserJSON) {
          const user = JSON.parse(storedUserJSON) as { access_token?: string };
          if (user?.access_token) {
            config.headers.Authorization = `Bearer ${user.access_token}`;
          }
        }
      } catch (error) {
        console.error("Failed to get user from localStorage", error);
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
};

applyAuthorizationInterceptor(client);
