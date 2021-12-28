import { Dispatch } from "redux";
import api from "../services/api";
import { AppThunk, AuthenticationParams } from "./types";

export const authenticate =
  (obj: AuthenticationParams): AppThunk =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ type: "LOGIN_PENDING" });
      const { data } = await api.post("/login/", obj);
      localStorage.setItem("@tva_token", data.access);
      dispatch({ type: "LOGIN_SUCCESS" });
      // dispatch({ type: "SET_LOGIN_STATUS", payload: true });
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR" });
    }
  };