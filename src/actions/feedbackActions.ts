import { MessageConfig } from "./types";

export const setSnackbarAlert = (config: MessageConfig) => ({
  type: "SET_SNACKBAR_MESSAGE",
  payload: config,
});
