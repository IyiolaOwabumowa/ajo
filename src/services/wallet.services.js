import Config from 'react-native-config';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export const walletService = {
  getWallet,
  updateBankDetails,
};

function getWallet(walletId, token) {
  return axios
    .get(`${Config.API_URL}/api/wallets/${walletId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const successObject = {status: response.status, data: response.data};
      return successObject;
    })
    .catch(function (error) {
      if (error.response) {
        const errorObject = {
          status: error.response.status,
          error: error.response,
        };
        return errorObject;
      }
    });
}

function updateBankDetails(token, accountnumber, bankcode, recipientcode) {
  const data = {
    bankcode,
    accountnumber,
    recipientcode
  };


  return axios
    .put(`${Config.API_URL}/api/wallets/create-recipient`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const successObject = {status: response.status, data: response.data};
      return successObject;
    })
    .catch(function (error) {
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
