import {userConstants} from '../constants/userConstants';
import {walletService} from '../services/wallet.services';
import AsyncStorage from '@react-native-community/async-storage';
import {authActions} from './auth.actions';
import {walletConstants} from '../constants/walletConstants';

export const walletActions = {
  getWallet,
  updateBankDetails,
};

function getWallet(walletId, token) {
  return dispatch => {
    dispatch(request());
    walletService
      .getWallet(walletId, token)
      .then(res => {
        if (res.status == 200) {
          dispatch(success(res));
        } else if (res.status == 401) {
          dispatch(authActions.deleteUserToken());
          dispatch(authActions.deleteId());
        } else {
          dispatch(
            failure("We're currently fixing an issue, please try again later"),
          );
        }
      })
      .catch(err => {
        dispatch(failure(err));
      });
  };

  function request() {
    return {type: walletConstants.GET_WALLET_REQUEST, requesting: true};
  }
  function success(wallet) {
    return {type: walletConstants.GET_WALLET_SUCCESS, wallet: wallet.data};
  }
  function failure(error) {
    return {type: walletConstants.GET_WALLET_FAILURE, error};
  }
}

function updateBankDetails(token, accountnumber, bank, recipientcode) {
  return dispatch => {
    dispatch(request());
    walletService
      .updateBankDetails(token, accountnumber, bank, recipientcode)
      .then(res => {
        if (res.status == 200) {
          dispatch(success(res, true));
          setTimeout(() => {
            dispatch(success(res, false));
          }, 2000);
        } else if (res.status == 400) {
          dispatch(failure(res.error.data.message.body));
          setTimeout(() => {
            dispatch(failure(null));
          }, 3000);
        } else if (res.status == 401) {
          dispatch(authActions.deleteUserToken());
          dispatch(authActions.deleteId());
        } else {
          console.log(res);
          dispatch(
            failure("We're currently fixing an issue, please try again later"),
          );
        }
      })
      .catch(err => {
        dispatch(failure(err));

        setTimeout(() => {
          dispatch(failure(null));
        }, 3000);
      });
  };

  function request() {
    return {type: walletConstants.UPDATE_WALLET_REQUEST, requesting: true};
  }
  function success(wallet, success) {
    return {
      type: walletConstants.UPDATE_WALLET_SUCCESS,
      wallet: wallet.data,
      success: success,
    };
  }
  function failure(error) {
    return {type: walletConstants.UPDATE_WALLET_FAILURE, error};
  }
}
