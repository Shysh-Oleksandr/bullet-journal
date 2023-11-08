import { Store } from "redux";

declare global {
  interface Window {
    store: Store;
  }
}

const enableStoreDebug = (store: Store): void => {
  const isDebuggingInChrome = Boolean(window.navigator.userAgent);

  if (isDebuggingInChrome) {
    window.store = store;
  }
};

export default enableStoreDebug;
