import { AnyAction } from "redux";
import { MessageConfig } from "./types";

export const setSnackbarAlert = (config: MessageConfig): AnyAction => ({
  type: "SET_SNACKBAR_MESSAGE",
  payload: config,
});
