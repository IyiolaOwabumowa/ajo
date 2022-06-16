import {userConstants} from '../constants/userConstants';

const initialState = {
  profile: null,
};

export default function userReducer(state = initialState, action: any) {
  switch (action.type) {
    case userConstants.GET_PROFILE_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case userConstants.GET_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.profile,
        requesting: false,
      };

    case userConstants.GET_PROFILE_FAILURE:
      return {
        error: action.error,
      };

    case userConstants.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case userConstants.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.profile,
        requesting: false,
        successful: action.successful,
      };

    case userConstants.UPDATE_PROFILE_FAILURE:
      return {
        error: action.error,
      };

    case userConstants.UPDATE_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case userConstants.UPDATE_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        profile: action.profile,
        requesting: false,
      };

    case userConstants.UPDATE_NOTIFICATIONS_FAILURE:
      return {
        error: action.error,
      };
    case userConstants.DELETE_PROFILE:
      return {
        profile: null,
      };

    default:
      return state;
  }
}
