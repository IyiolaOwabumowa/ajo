import {authConstants} from '../constants/authConstants';
import {authService} from '../services/auth.services';
import AsyncStorage from '@react-native-community/async-storage';
import {circleActions} from './circle.actions';
import {userActions} from './user.actions';
import {walletConstants} from '../constants/walletConstants';
import {circleConstants} from '../constants/circleConstants';

export const authActions = {
  login,
  getId,
  deleteId,
  changePassword,
  resetPassword,
  sendResetLink,
  finishOnBoarding,
  signup,
  getUserToken,
  saveUserToken,
  deleteUserToken,
  clearErrors,
  clearState,
  resetRegistered,
  getOnBoarding,
  saveOnBoarding,
};

function signup({username, phone, deviceId, email, password}) {
  return dispatch => {
    dispatch(request());

    authService.signup(username, phone, deviceId, email, password).then(res => {
      if (res.status == 200) {
        dispatch(success(true, null, res.data.token, res.data._id));
        dispatch(saveUserToken(res.data.token));
        dispatch(saveId(res.data._id));
        // dispatch(
        //   success(true, `A confirmation link has been sent to your email`),
        // );
        // setTimeout(() => {
        //   dispatch(success(true, null));
        // }, 5000);
      } else {
        dispatch(failure(res.error.body, false));
        setTimeout(() => {
          dispatch(failure(null, false));
        }, 5000);
      }
      // userActions.saveUserId(auth.id)
    });
  };

  function request() {
    return {type: authConstants.REGISTER_REQUEST};
  }
  function success(registered, msg, token, _id) {
    return {
      type: authConstants.REGISTER_SUCCESS,
      registered,
      toastMessage: msg,
      token,
      _id,
    };
  }
  function failure(error, registered) {
    return {type: authConstants.REGISTER_FAILURE, error: error, registered};
  }
}

function finishOnBoarding() {
  return dispatch => {
    dispatch(finish());
    dispatch(saveOnBoarding('false'));
  };

  function finish() {
    return {type: authConstants.FINISH_ONBOARDING};
  }
}
function login(form) {
  return dispatch => {
    dispatch(request(form.email));

    authService.login(form).then(res => {
      if (res.status == 200) {
        console.log(res.data);
        dispatch(
          success(
            res.data.token,
            res.data._id,
            res.data.username,
            null,
            res.data.onBoarding,
          ),
        );
        dispatch(saveUserToken(res.data.token));
        dispatch(saveOnBoarding(`${res.data.onBoarding}`));
        console.log(res.data.onBoarding);
        dispatch(saveId(res.data._id));
      } else if (res.status == 401) {
        dispatch(failure('Invalid username or password'));
        setTimeout(() => {
          dispatch(failure(null));
        }, 2000);
      } else if (res.status == 400) {
        dispatch(
          success(
            res.data.token,
            res.data._id,
            res.data.username,
            res.data.error.data.message.body,
            res.data.error.data.onBoarding,
          ),
        );
        setTimeout(() => {
          dispatch(failure(null));
        }, 2000);
      } else {
        dispatch(
          failure("We're currently fixing something, please try again later"),
        );
        setTimeout(() => {
          dispatch(failure(null, false));
        }, 2000);
      }
      // userActions.saveUserId(auth.id)
    });
  };

  function request(user) {
    return {type: authConstants.LOGIN_REQUEST};
  }
  function success(token, _id, username, error, onBoarding) {
    return {
      type: authConstants.LOGIN_SUCCESS,
      token,
      _id,
      username,
      error,
      onBoarding,
    };
  }
  function failure(error) {
    return {type: authConstants.LOGIN_FAILURE, error};
  }
  function saveToken() {
    return {type: authConstants.SAVE_TOKEN};
  }
}

function changePassword(token, form) {
  return dispatch => {
    dispatch(request());

    authService
      .changePassword(token, form)
      .then(res => {
        if (res.status == 200) {
          dispatch(success(res.data.message.body));
          setTimeout(() => {
            dispatch(success(null));
          }, 4000);
        }
        if (res.status == 401) {
          dispatch(deleteUserToken());
          dispatch(deleteId());
        }
        if (res.status == 400) {
          dispatch(failure(res.error.data.message.body));
          setTimeout(() => {
            dispatch(failure(null));
          }, 4000);
        }

        // userActions.saveUserId(auth.id)
      })
      .catch(err => {
        dispatch(failure(err.response.data.message.body));
        setTimeout(() => {
          dispatch(failure(null));
        }, 4000);
      });
  };

  function request() {
    return {type: authConstants.PASSWORD_CHANGE_REQUEST};
  }
  function success(message) {
    return {type: authConstants.PASSWORD_CHANGE_SUCCESS, message: message};
  }
  function failure(error) {
    return {type: authConstants.PASSWORD_CHANGE_FAILURE, error};
  }
}

function resetPassword(token, id, form) {
  return dispatch => {
    dispatch(request());

    authService
      .resetPassword(token, id, form)
      .then(res => {
        if (res.status == 200) {
          dispatch(success(res.data.message.body, true));
          setTimeout(() => {
            dispatch(success(null, false));
          }, 4000);
        }
        if (res.status == 401) {
          dispatch(
            "This link has has expired, kindly go back and click on 'Forgot Password' so we can send you a new link",
          );
        }
        if (res.status == 400) {
          dispatch(failure(res.error.data.message.body));
          setTimeout(() => {
            dispatch(failure(null));
          }, 4000);
        }

        // userActions.saveUserId(auth.id)
      })
      .catch(err => {
        dispatch(failure(err.response.data.message.body));
        setTimeout(() => {
          dispatch(failure(null));
        }, 4000);
      });
  };

  function request() {
    return {type: authConstants.PASSWORD_RESET_REQUEST};
  }
  function success(message, successful) {
    return {
      type: authConstants.PASSWORD_RESET_SUCCESS,
      message: message,
      successful: successful,
    };
  }
  function failure(error) {
    return {type: authConstants.PASSWORD_RESET_FAILURE, error};
  }
}

function sendResetLink(email) {
  return dispatch => {
    dispatch(request(email));

    authService
      .sendResetLink(email)
      .then(res => {
        if (res.status && res.status == 200) {
          dispatch(success(`We've sent a reset link to your email`));
          setTimeout(() => {
            dispatch(success(null));
          }, 5000);
        } else if (res.status == 400) {
          dispatch(failure('Please enter a registered email address'));
          setTimeout(() => {
            dispatch(failure(null));
          }, 5000);
        } else {
          console.log(res)
          // console.log(res);
          dispatch(
            failure(
              'Our team is currently fixing this issue, please give us a few moments',
            ),
          );
          setTimeout(() => {
            dispatch(failure(null));
          }, 5000);
        }
        // userActions.saveUserId(auth.id)
      })
      .catch(error => {
        dispatch(failure(error));
      });
  };

  function request() {
    return {type: authConstants.RESET_LINK_REQUEST};
  }
  function success(msg) {
    return {type: authConstants.RESET_LINK_SUCCESS, resetMessage: msg};
  }
  function failure(error) {
    return {type: authConstants.RESET_LINK_FAILURE, error};
  }
}

function getUserToken() {
  return dispatch => {
    authService
      .getItem('token')
      .then(value => {
        dispatch(getToken(value));
      })
      .catch(err => {});
  };

  function getToken(token) {
    return {type: authConstants.GET_TOKEN, token};
  }
}

function getOnBoarding() {
  return dispatch => {
    authService
      .getItem('onBoarding')
      .then(value => {
        dispatch(getOnBoarding(value));
      })
      .catch(err => {});
  };

  function getOnBoarding(onBoarding) {
    return {type: authConstants.GET_ONBOARDING_STATUS, onBoarding};
  }
}
function saveUserToken(token) {
  return dispatch => {
    authService.saveItem('token', token).then(token => {
      // dispatch(saveToken(token));
    });
  };

  function saveToken(token) {
    return {type: authConstants.SAVE_TOKEN, token};
  }
}

function saveOnBoarding(onBoarding) {
  return dispatch => {
    authService.saveItem('onBoarding', onBoarding).then(onBoarding => {});
  };
}

function saveId(_id) {
  return dispatch => {
    authService.saveItem('_id', _id).then(_id => {});
  };
}

function getId() {
  return dispatch => {
    authService
      .getItem('_id')
      .then(value => {
        dispatch(getId(value));
      })
      .catch(err => {});
  };

  function getId(_id) {
    return {type: authConstants.USER_GET_ID, _id};
  }
}

function deleteUserToken() {
  return dispatch => {
    authService.deleteItem('token').then(value => {
      dispatch(deleteToken());
      dispatch(userActions.deleteUserStorage());
      dispatch({type: walletConstants.DELETE_WALLET});
      dispatch({type: circleConstants.CLEAR_CIRCLE});
    });
  };

  function deleteToken() {
    return {type: authConstants.DELETE_TOKEN};
  }
}

function deleteId() {
  return dispatch => {
    authService.deleteItem('_id').then(value => {
      dispatch(deleteId());
    });
  };

  function deleteId() {
    return {type: authConstants.DELETE_ID};
  }
}

function clearErrors() {
  return {
    type: authConstants.CLEAR_ERRORS,
  };
}

function clearState() {
  return {
    type: authConstants.CLEAR_STATE,
  };
}

function resetRegistered() {
  return {
    type: authConstants.RESET_REGISTERED,
  };
}
