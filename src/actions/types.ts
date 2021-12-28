import { Action, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

export type StoreState = {
  authReducer: AuthState;
};

export type AuthState = {
  loading: boolean;
  successLogin: boolean;
  loginAttempts: number;
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

export type AuthenticationParams = {
  username: string;
  password: string;
};

export type ApplicationAction =
  | SetLoginPending
  | SetLoginSuccess
  | SetLoginError;
