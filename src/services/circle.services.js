import Config from 'react-native-config';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

export const circleService = {
  generateCircle,
  updateCircle,
  createCircle,
  startAjo,
};

function generateCircle(token, id) {
  return axios
    .get(`${Config.API_URL}/api/circles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    })
    .then(response => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
}

function updateCircle(token, id, form, seconds) {
  if (!seconds) {
    form.round.duration = form.round.duration * 24 * 3600;
  }
  const now = moment();
  form.expires = moment(now)
    .add(form.round.duration * form.capacity, 'seconds')
    .format();
  var data = form;
  console.log(form);

  return axios
    .put(`${Config.API_URL}/api/circles/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    })
    .then(response => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
}

function createCircle(token, form) {
  const duration = form.roundDuration * 24 * 3600;

  var data = {...form, roundDuration: duration};
  return axios
    .post(`${Config.API_URL}/api/circles/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    })
    .then(response => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
}

function startAjo(token, id) {
  return axios
    .get(`${Config.API_URL}/api/circles/start/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    })
    .then(response => {
      return response;
    })
    .catch(function (error) {
      console.log(error.response);
      return error;
    });
}
