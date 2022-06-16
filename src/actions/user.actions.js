import {userConstants} from '../constants/userConstants';
import {userService} from '../services/user.services';
import AsyncStorage from '@react-native-community/async-storage';
import {authActions} from './auth.actions';

export const userActions = {
  getProfile,
  updateNotifications,
  updateUserProfile,
  deleteUserStorage,
};

function getProfile(_id, token) {
  return dispatch => {
    dispatch(request());
    userService
      .getProfile(_id, token)
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
    return {type: userConstants.GET_PROFILE_REQUEST, requesting: true};
  }
  function success(res) {
    return {type: userConstants.GET_PROFILE_SUCCESS, profile: res.data.user};
  }
  function failure(error) {
    return {type: userConstants.GET_PROFILE_FAILURE, error};
  }
}

function updateNotifications(_id, token, settings) {
  return dispatch => {
    dispatch(request());
    userService
      .updateNotifications(_id, token, settings)
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

  function success(res) {
    return {
      type: userConstants.UPDATE_NOTIFICATIONS_SUCCESS,
      profile: res.data.user,
    };
  }
  function failure(error) {
    return {type: userConstants.UPDATE_NOTIFICATIONS_FAILURE, error};
  }
  function request() {
    return {type: userConstants.UPDATE_NOTIFICATIONS_REQUEST, requesting: true};
  }
}

function updateUserProfile(_id, token, firstname, lastname, dob, occupation) {
  return dispatch => {
    dispatch(request());
    userService
      .updateUserProfile(_id, token, firstname, lastname, dob, occupation)
      .then(res => {
        if (res.status == 200) {
          dispatch(success(res, true));
          setTimeout(() => {
            dispatch(success(res, false));
          }, 1000);
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

  function success(res, successful) {
    return {
      type: userConstants.UPDATE_PROFILE_SUCCESS,
      profile: res.data.user,
      successful: successful,
    };
  }
  function failure(error) {
    return {type: userConstants.UPDATE_PROFILE_FAILURE, error};
  }
  function request() {
    return {type: userConstants.UPDATE_PROFILE_REQUEST, requesting: true};
  }
}

function deleteUserStorage() {
  return dispatch => {
    dispatch(del());
  };

  function del() {
    return {type: userConstants.DELETE_PROFILE};
  }
}
