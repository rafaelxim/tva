import { ApplicationAction, AuthState } from "../actions/types";

const obj: AuthState = {
  loading: false,
  successLogin: false,
  loginAttempts: 0,
};

// eslint-disable-next-line default-param-last
export default (state = obj, action: ApplicationAction): AuthState => {
  switch (action.type) {
    case "LOGIN_PENDING":
      return { ...state, loading: true };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        loginAttempts: 0,
        successLogin: true,
        user: action.payload,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        loginAttempts: state.loginAttempts + 1,
        successLogin: false,
      };

    case "SET_AUTH_STATE":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
