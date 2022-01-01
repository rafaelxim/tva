import { Action, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

export type StoreState = {
  authReducer: AuthState;
  feedbackReducer: MessageConfig;
};

export type AuthState = {
  loading: boolean;
  successLogin: boolean;
  loginAttempts: number;
  user: string;
};

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  StoreState,
  unknown,
  AnyAction
>;

export interface SetLoginPending extends Action {
  type: "LOGIN_PENDING";
}

export interface SetLoginSuccess extends Action {
  type: "LOGIN_SUCCESS";
}

export interface SetLoginError extends Action {
  type: "LOGIN_ERROR";
}

export interface SetAuthState extends Action {
  type: "SET_AUTH_STATE";
  payload: AuthState;
}
export interface SetSnackBarMessage extends Action {
  type: "SET_SNACKBAR_MESSAGE";
  payload: MessageConfig;
}

export type AuthenticationParams = {
  username: string;
  password: string;
};

export type MessageConfig = {
  message: string;
  isVisible: boolean;
  severity: "info" | "warning" | "error" | "success";
};

export type ApplicationAction =
  | SetLoginPending
  | SetLoginSuccess
  | SetLoginError
  | SetSnackBarMessage
  | SetAuthState;
