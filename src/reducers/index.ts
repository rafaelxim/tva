import { combineReducers } from "redux";
import { StoreState } from "../actions/types";
import authReducer from "./authReducer";
import feedbackReducer from "./feedbackReducer";

const reducers = combineReducers<StoreState>({
  authReducer,
  feedbackReducer,
});

export default reducers;
