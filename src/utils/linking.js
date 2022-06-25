const config = {
  screens: {
    Splash: {
      screens: {
        ResetPassword: {
          path: 'reset/:token/:id',
          parse: {
            id: id => `${id}`,
            token: token => `${token}`,
          },
        },
      },
    },

    Home: {
      screens: {
        Dashboard: {
          path: 'invite/:token/:circleId/:userId',
          parse: {
            circleId: circleId => `${circleId}`,
            userId: userId => `${userId}`,
          },
        },
      },
    },
  },
};

const linking = {
  prefixes: ['http://getajo.app', 'ajo://app'],
  config,
};

export default linking;
