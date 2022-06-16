import {combineReducers} from 'redux';
import authReducer from './auth.reducers';
import userReducer from './user.reducers';
import walletReducer from './wallet.reducers';
import circleReducer from './circle.reducers';

export const rootReducer = combineReducers({
  authReducer,
  userReducer,
  walletReducer,
  circleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
