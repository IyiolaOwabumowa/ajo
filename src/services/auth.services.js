import Config from 'react-native-config';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export const authService = {
  login,
  changePassword,
  resetPassword,
  getItem,
  saveItem,
  deleteItem,
  sendResetLink,
  signup,
};

function signup(username, phone, deviceId, email, password) {
  const signupDetails = {
    username,
    phone,
    deviceId,
    email,
    password,
  };
  return axios
    .post(`${Config.API_URL}/api/auth/register`, signupDetails)
    .then(response => {
      const successObject = {status: response.status, data: response.data};
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded
        const values = Object.values(error.response.data);
        const errorObject = {status: error.response.status, error: values[0]};
        // for (const value of values) {
        //   console.log(value[0])
        // }

        return errorObject;
      }
    });
}

function login(form) {
  const loginDetails = {
    ...form,
  };

  return axios
    .post(`${Config.API_URL}/api/auth/login`, loginDetails)
    .then(response => {
      const successObject = {status: response.status, data: response.data};
      return successObject;
    })
    .catch(function (error) {
      // console.log(error.response)
      console.log(error.response);
      if (error.response) {
        const errorObject = {
          status: error.response.status,
          error: error.response,
        };

        return errorObject;
      }
    });
}

function changePassword(token, form) {
  console.log(form);
  return axios
    .post(`${Config.API_URL}/api/auth/change-password`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const successObject = {status: response.status, data: response.data};
      return successObject;
    })
    .catch(function (error) {
      throw error;
      // console.log(error.response)
      // if (error.response) {
      //   const errorObject = {
      //     status: error.response.status,
      //     response: error.response,
      //   };

      //   return errorObject;
      // }
    });
}

function resetPassword(token, id, form) {
  console.log(form);
  return axios
    .post(`${Config.API_URL}/api/auth/reset-password/${id}`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const successObject = {status: response.status, data: response.data};
      return successObject;
    })
    .catch(function (error) {
      throw error;
      // console.log(error.response)
      // if (error.response) {
      //   const errorObject = {
      //     status: error.response.status,
      //     response: error.response,
      //   };

      //   return errorObject;
      // }
    });
}

function sendResetLink(email) {
  const emailDetails = {email};
  return axios
    .post(`${Config.API_URL}/api/auth/trigger-reset`, emailDetails, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const successObject = {status: response.status};
      //  const token = res.data.token;
      //  const id = 1;
      //  const auth = {id, token}
      //  return auth;
      return successObject;
    })
    .catch(function (error) {
      console.log(error);
      if (error.response) {
        const errorObject = {
          status: error.response.status,
          error: error.response,
        };

        return errorObject;
      }
    });
}

function getItem(itemName) {
  return AsyncStorage.getItem(itemName)
    .then(value => {
      return value;
    })
    .catch(err => {
      return err;
    });
}

function saveItem(itemName, itemValue) {
  return AsyncStorage.setItem(itemName, itemValue)
    .then(value => {
      return value;
    })
    .catch(err => {
      return err;
    });
}

function deleteItem(itemName) {
  return AsyncStorage.removeItem(itemName)
    .then(() => {
      const success = 'Delete Successful';
      return success;
    })
    .catch(err => {
      return err;
    });
}

// function logout() {
//   deleteData("@user");
// }

// const storeData = async data => {

//     await AsyncStorage.setItem("@user", data)

// };

// const deleteData= async data => {
//   try {
//     await AsyncStorage.removeItem(data);
//   } catch (error) {
//     // Error retrieving data
//     console.log(error.message);
//   }
// };
