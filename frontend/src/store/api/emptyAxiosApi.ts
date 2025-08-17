import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import axios from "axios";
import config from "../../config/config";
import { TAG } from "../models";

const tags = Object.values(TAG);

export const emptyAxiosApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: config.server.url }),
  reducerPath: "axios",
  endpoints: () => ({}),
  tagTypes: tags,
});

export const client = axios.create({
  baseURL: `${config.server.newUrl}/api`,
});
