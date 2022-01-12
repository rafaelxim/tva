import { AnyAction, Dispatch } from "redux";
import jwt_decode from "jwt-decode";
import api from "../services/api";
import {
  AppThunk,
  AuthenticationParams,
  AuthState,
  DecodedToken,
  LoginResponse,
  UserDetailsResponse,
} from "./types";

export const authenticate =
  (obj: AuthenticationParams): AppThunk =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ type: "LOGIN_PENDING" });
      const { data } = await api.post<LoginResponse>("/login/", obj);
      localStorage.setItem("@tva_token", data.access);
      localStorage.setItem("@tva_refresh_token", data.refresh);
      const decodedToken: DecodedToken = jwt_decode(data.access);
      const details = await api.get<UserDetailsResponse>(
        `/details/${decodedToken.user_id}/`
      );
      dispatch({ type: "LOGIN_SUCCESS", payload: details.data });
    } catch (error) {
      console.log(error);
      dispatch({ type: "LOGIN_ERROR" });
    }
  };

export const setAuthState = (authState: AuthState): AnyAction => ({
  type: "SET_AUTH_STATE",
  payload: authState,
});
