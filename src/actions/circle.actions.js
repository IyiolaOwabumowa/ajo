import {circleConstants} from '../constants/circleConstants';
import {circleService} from '../services/circle.services';
import axios from 'axios';
import Config from 'react-native-config';
import {userActions} from './user.actions';

export const circleActions = {
  generateCircles,
  updateCircle,
  createCircle,
  activeCircle,
  startAjo,
};

function generateCircles(token, circleIds, active) {
  return dispatch => {
    dispatch(request());
    var circles = [];

    const promises = circleIds.map(id => {
      return axios
        .get(`${Config.API_URL}/api/circles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          return response.data.circle;
        })
        .catch(function (error) {
          console.log(error);
          dispatch(failure(error));
        });
    });

    Promise.all(promises).then(results => {
      var activeCircle;
      var sum = 0;
      if (results.length > 0) {
        results.forEach(circle => {
          sum = sum + circle.capacity * circle.fee;
        });
      } else {
        sum = 0;
      }

      if (active) {
        activeCircle = results.find(circle => {
          return circle._id == active._id;
        });
      } else {
        activeCircle = null;
      }

      dispatch(success(results, activeCircle, sum));
    });

    // circleService
    //   .generateCircle(token, circleId)
    //   .then(res => {

    //     if (res.status == 200) {
    //       dispatch(success(res.data.circle));
    //     }

    //     // if (res.status == 401) {
    //     // } else {
    //     //   dispatch(
    //     //     failure("We're currently fixing an issue, please try again later"),
    //     //   );
    //     // }
    //   })
    //   .catch(e => dispatch(failure(e)));
  };

  function request() {
    return {type: circleConstants.GENERATE_CIRCLES_REQUEST, requesting: true};
  }

  function success(circle, active, sum) {
    return {
      type: circleConstants.GENERATE_CIRCLES_SUCCESS,
      circle,
      active: active,
      sum: sum,
    };
  }
  function failure(error) {
    return {type: circleConstants.GENERATE_CIRCLES_FAILURE, error};
  }
}

function updateCircle(token, id, form, seconds) {
  return dispatch => {
    dispatch(request());
    circleService
      .updateCircle(token, id, form, seconds)
      .then(res => {
        if (res.status == 200) {
          dispatch(success(res.data.circle));
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

  function success(circle) {
    return {type: circleConstants.UPDATE_CIRCLE_SUCCESS, circle: circle};
  }
  function failure(error) {
    return {type: circleConstants.UPDATE_CIRCLE_FAILURE, error};
  }
  function request() {
    return {type: circleConstants.UPDATE_CIRCLE_REQUEST, requesting: true};
  }
}

function createCircle(token, form) {
  return dispatch => {
    dispatch(request());
    circleService
      .createCircle(token, form)
      .then(res => {
        if (res.status == 200) {
          dispatch(success(res.data.circle, true));
          setTimeout(() => {
            dispatch(success(res.data.circle, false));
          }, 3000);
        }
        if (res.status == 401) {
          dispatch(authActions.deleteUserToken());
          dispatch(authActions.deleteId());
        }
        if (res.response) {
          if (res.response.status == 400) {
            dispatch(failure(res.response.data.message.body));
            setTimeout(() => {
              dispatch(failure(null));
            }, 3000);
          }
        }
        //  else {
        //   dispatch(
        //     failure("We're currently fixing an issue, please try again later"),
        //   );
        //   setTimeout(() => {
        //     dispatch(failure(null));
        //   }, 3000);
        // }
      })
      .catch(err => {
        console.log(err);
        dispatch(failure(err));
      });
  };

  function success(circle, successful) {
    return {
      type: circleConstants.CREATE_CIRCLE_SUCCESS,
      circle: circle,
      successful,
    };
  }
  function failure(error) {
    return {type: circleConstants.CREATE_CIRCLE_FAILURE, error};
  }
  function request() {
    return {type: circleConstants.CREATE_CIRCLE_REQUEST, requesting: true};
  }
}

function startAjo(token, id) {
  return dispatch => {
    dispatch(request());
    circleService
      .startAjo(token, id)
      .then(res => {
        if (res.status == 200) {
          console.log(res.data);
          dispatch(success(res.data.message.body));
        } else if (res.status == 401) {
          dispatch(authActions.deleteUserToken());
          dispatch(authActions.deleteId());
        } else if (res.status == 400) {
          dispatch(failure(res.data.message.body));
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

  function success(message) {
    return {type: circleConstants.START_AJO_SUCCESS, message: message};
  }
  function failure(error) {
    return {type: circleConstants.START_AJO_FAILURE, error};
  }
  function request() {
    return {type: circleConstants.START_AJO_REQUEST, requesting: true};
  }
}

function activeCircle(circle) {
  return dispatch => {
    dispatch(success(circle));
  };

  function success(circle) {
    return {type: circleConstants.ACTIVE_CIRCLE, active: circle};
  }
}
