import {circleConstants} from '../constants/circleConstants';

const initialState = {
  circles: [],
};

export default function circleReducer(state = initialState, action) {
  switch (action.type) {
    case circleConstants.GENERATE_CIRCLES_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case circleConstants.GENERATE_CIRCLES_SUCCESS:
      if (action.active == null) {
        return {
          ...state,
          requesting: false,
          circles: action.circle,
          expectedTotalIncome: action.sum,
        };
      } else {
        return {
          ...state,
          requesting: false,
          circles: action.circle,
          active: action.active,
        };
      }

    case circleConstants.GENERATE_CIRCLES_FAILURE:
      return {
        requesting: false,
        circleError: action.error,
      };

    case circleConstants.UPDATE_CIRCLE_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case circleConstants.UPDATE_CIRCLE_SUCCESS:
      return {
        ...state,
        requesting: false,
        active: action.circle,
      };

    case circleConstants.UPDATE_CIRCLE_FAILURE:
      return {
        ...state,
        requesting: false,
        circleError: action.error,
      };

    case circleConstants.CREATE_CIRCLE_REQUEST:
      return {
        ...state,
        requesting: true,
        successful: false,
      };

    case circleConstants.CREATE_CIRCLE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: action.successful,
        active: action.circle,
      };

    case circleConstants.CREATE_CIRCLE_FAILURE:
      return {
        ...state,
        requesting: false,
        successful: false,
        circleError: action.error,
      };

    case circleConstants.START_AJO_REQUEST:
      return {
        ...state,
        requesting: false,
        error: action.error,
      };

    case circleConstants.START_AJO_FAILURE:
      return {
        ...state,
        requesting: false,
        active: {...state.active, message: action.error},
      };

    case circleConstants.START_AJO_SUCCESS:
      return {
        ...state,
        requesting: false,
        active: {...state.active, message: action.message},
      };

    case circleConstants.ACTIVE_CIRCLE:
      return {
        ...state,
        active: action.active,
      };

    case circleConstants.CLEAR_CIRCLE:
      return {
        requesting: true,
        circles: null,
      };

    default:
      return state;
  }
}
