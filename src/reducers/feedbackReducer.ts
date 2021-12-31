import { ApplicationAction, MessageConfig } from "../actions/types";

const obj: MessageConfig = {
  message: "",
  isVisible: false,
  severity: "info",
};

// eslint-disable-next-line default-param-last
export default (state = obj, action: ApplicationAction): MessageConfig => {
  switch (action.type) {
    case "SET_SNACKBAR_MESSAGE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
