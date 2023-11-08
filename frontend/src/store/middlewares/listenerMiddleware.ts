import {
  createListenerMiddleware,
  TypedStartListening,
  TypedStopListening,
} from "@reduxjs/toolkit";
import logging from "../../config/logging";
import { AppDispatch, RootState } from "../store";

const appListenerMiddleware = createListenerMiddleware({
  onError: (error, errorInfo) => {
    logging.error(`raised by: ${errorInfo.raisedBy}. Error: ${error}`);
  },
});

export default appListenerMiddleware;

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export type AppStopListening = TypedStopListening<RootState, AppDispatch>;

export const startAppListening =
  appListenerMiddleware.startListening as AppStartListening;
