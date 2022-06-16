import {walletConstants} from '../constants/walletConstants';

const initialState = {
  wallet: {},
};

export default function walletReducer(state = initialState, action: any) {
  switch (action.type) {
    case walletConstants.GET_WALLET_REQUEST:
      return {
        ...state,
        requesting: true,
        error: null,
      };

    case walletConstants.GET_WALLET_SUCCESS:
      return {
        ...state,
        requesting: false,
        wallet: action.wallet,
      };

    case walletConstants.GET_WALLET_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.error,
      };

    case walletConstants.UPDATE_WALLET_REQUEST:
      return {
        ...state,
        requesting: true,
        error: null,
        success: false,
      };

    case walletConstants.UPDATE_WALLET_SUCCESS:
      return {
        ...state,
        requesting: false,
        wallet: action.wallet,

        success: action.success,
      };

    case walletConstants.UPDATE_WALLET_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.error,
        success: false,
      };

    case walletConstants.DELETE_WALLET:
      return {
        wallet: {},
      };
    default:
      return state;
  }
}
