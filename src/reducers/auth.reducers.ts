import {authConstants} from '../constants/authConstants';
import {authActions} from '../actions/auth.actions';

const initialState = {
  token: null,
};

export default function authReducer(state = initialState, action: any) {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return {
        onboarding: false,
        token: null,
        loggingIn: true,
      };
    case authConstants.LOGIN_SUCCESS:
      return {
        token: action.token,
        userId: action._id,
        loggingIn: false,
        loginError: action.error,
        onboarding: action.onBoarding,
      };

    case authConstants.LOGIN_FAILURE:
      return {
        onboarding: false,
        token: null,
        loggingIn: false,
        loginError: action.error,
      };
    case authConstants.REGISTER_REQUEST:
      return {
        ...state,
        registering: true,
      };
    case authConstants.REGISTER_SUCCESS:
      return {
        ...state,
        token: action.token,
        userId: action._id,
        registering: false,
        registered: action.registered,
        toastMessage: action.toastMessage,
      };
    case authConstants.REGISTER_FAILURE:
      return {
        ...state,
        registering: false,
        errorMessage: action.error,
        registered: action.registered,
      };

    case authConstants.PASSWORD_CHANGE_REQUEST:
      return {
        ...state,
        requesting: true,
      };
    case authConstants.PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        message: action.message,
        requesting: false,
      };

    case authConstants.PASSWORD_CHANGE_FAILURE:
      return {
        ...state,
        error: action.error,
        requesting: false,
      };
    case authConstants.PASSWORD_RESET_REQUEST:
      return {
        ...state,
        requesting: true,
      };
    case authConstants.PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        message: action.message,
        requesting: false,
        successful: action.successful
      };

    case authConstants.PASSWORD_RESET_FAILURE:
      return {
        ...state,
        error: action.error,
        requesting: false,
      };

    case authConstants.FINISH_ONBOARDING:
      return {
        ...state,
        onboarding: false,
      };

    case authConstants.GET_ONBOARDING_STATUS:
      return {
        ...state,
        onboarding: action.onBoarding == 'false' ? false : true,
      };

    case authConstants.RESET_REGISTERED:
      return {
        ...state,
      };

    case authConstants.RESET_LINK_REQUEST:
      return {
        ...state,
        sendingReq: true,
      };
    case authConstants.RESET_LINK_SUCCESS:
      return {
        ...state,
        sendingReq: false,
        resetMessage: action.resetMessage,
      };
    case authConstants.RESET_LINK_FAILURE:
      return {
        ...state,
        sendingReq: false,
        resetError: action.error,
      };
    case authConstants.CLEAR_ERRORS:
      return {
        ...state,
        errorMessage: null,
      };

    case authConstants.GET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case authConstants.USER_GET_ID:
      return {
        ...state,
        userId: action._id,
      };

    case authConstants.DELETE_ID:
      return {
        ...state,
        userId: null,
      };

    case authConstants.SAVE_TOKEN:
      return {
        ...state,
        token: action.token,
      };

    case authConstants.DELETE_TOKEN:
      return {
        onboarding: true,
        token: null,
      };
    case authConstants.LOGOUT:
      return {
        onboarding: true,
        loginErrorMessage: '',
        token: null,
      };

    case authConstants.CLEAR_STATE:
      return {
        onboarding: true,
      };

    default:
      return state;
  }
}
