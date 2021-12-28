import { combineReducers } from "redux";
import { StoreState } from "../actions/types";
import authReducer from "./authReducer";

const reducers = combineReducers<StoreState>({
  authReducer,
});

export default reducers;
