export const environment: EnvironmentCredentials = {
  // appsUrl: 'apps', // `~/public/apps`
  appsUrl: 'https://raw.githubusercontent.com/CodyTolene/pip-apps/main',
  production: false,
  google: {
    firebase: {
      projectId: 'pip-terminal',
      appId: '1:438882577130:web:dc1124a2ab2ad5d21c0593',
      storageBucket: 'pip-terminal.firebasestorage.app',
      apiKey: 'AIzaSyBhWM3EaT62lKlKqJJNP5Ggc-O98k2B5TY',
      authDomain: 'pip-terminal.firebaseapp.com',
      messagingSenderId: '438882577130',
      measurementId: '', // No analytics for development
    },
    maps: {
      apiKey: 'AIzaSyBhWM3EaT62lKlKqJJNP5Ggc-O98k2B5TY',
    },
  },
};
