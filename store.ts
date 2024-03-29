import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import {composeWithDevTools} from "redux-devtools-extension"

import reducer from "./src/reducers";

const loggerMiddleware = createLogger();

export const store = createStore(
  reducer,
composeWithDevTools(applyMiddleware(thunkMiddleware))
);
