export const environment: EnvironmentCredentials = {
  apiUrl: 'https://us-central1-pip-terminal.cloudfunctions.net/api',
  appsUrl: 'https://raw.githubusercontent.com/CodyTolene/pip-apps/releases',
  google: {
    firebase: {
      apiKey: 'AIzaSyD0ESBvQ6Ok20ddJmS0kI7K-N6u6LXXlyw',
      appId: '1:438882577130:web:dc1124a2ab2ad5d21c0593',
      authDomain: 'pip-boy.com', // 'pip-terminal.firebaseapp.com'
      measurementId: 'G-1Z6DNZH2C2',
      messagingSenderId: '438882577130',
      projectId: 'pip-terminal',
      storageBucket: 'pip-terminal.firebasestorage.app',
    },
    maps: {
      apiKey: 'AIzaSyD0ESBvQ6Ok20ddJmS0kI7K-N6u6LXXlyw',
    },
    recaptcha: {
      apiKey: '6LfWlacrAAAAAPJGalCzAuQLo4LIqbrZzFY9u6qZ',
    },
  },
  isProduction: true,
};
