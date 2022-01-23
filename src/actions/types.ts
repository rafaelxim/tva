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
  user?: UserDetailsResponse;
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
  payload: UserDetailsResponse;
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

export type LoginResponse = {
  access: string;
  refresh: string;
};

export type Roles = {
  name: Groups;
}[];

export type UserDetailsResponse = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  groups: Roles;
};

export type Groups =
  | "Administrator"
  | "Operator"
  | "Attendant"
  | "Company"
  | "Customer";

export type DecodedToken = {
  user_id: number;
};

export type ApplicationAction =
  | SetLoginPending
  | SetLoginSuccess
  | SetLoginError
  | SetSnackBarMessage
  | SetAuthState;
