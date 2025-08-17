export const environment: EnvironmentCredentials = {
  apiUrl: 'http://127.0.0.1:5001/pip-terminal/us-central1/api',
  // appsUrl: 'apps', // `~/public/apps`
  appsUrl: 'https://raw.githubusercontent.com/CodyTolene/pip-apps/releases',
  google: {
    firebase: {
      apiKey: 'AIzaSyD0ESBvQ6Ok20ddJmS0kI7K-N6u6LXXlyw',
      appId: '1:438882577130:web:dc1124a2ab2ad5d21c0593',
      authDomain: 'pip-boy.local',
      measurementId: '',
      messagingSenderId: '438882577130',
      projectId: 'pip-terminal',
      storageBucket: 'pip-terminal.firebasestorage.app',
    },
    maps: {
      apiKey: undefined,
    },
    recaptcha: {
      // Development testing key
      apiKey: '6LeI9KcrAAAAALsvkMIdgNcuQgFOGCax6C4nUCVC',
    },
  },
  isProduction: false,
};
