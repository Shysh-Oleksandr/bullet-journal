import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { TAG } from "../models";
import config from "../../config/config";

const tags = Object.values(TAG);

export const emptyAxiosApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: config.server.url }),
  reducerPath: "axios",
  endpoints: () => ({}),
  tagTypes: tags,
});
