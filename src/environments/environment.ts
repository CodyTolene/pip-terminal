export const environment: EnvironmentCredentials = {
  // appsUrl: 'apps', // `~/public/apps`
  appsUrl: 'https://raw.githubusercontent.com/CodyTolene/pip-apps/main',
  google: {
    firebase: {
      projectId: 'pip-terminal',
      appId: '1:438882577130:web:dc1124a2ab2ad5d21c0593',
      storageBucket: undefined,
      apiKey: 'AIzaSyD0ESBvQ6Ok20ddJmS0kI7K-N6u6LXXlyw',
      authDomain: undefined,
      messagingSenderId: undefined,
      measurementId: undefined,
    },
    maps: {
      apiKey: undefined,
    },
    recaptcha: {
      apiKey: '',
    },
  },
  isProduction: false,
};
