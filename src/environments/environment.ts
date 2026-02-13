import { EnvironmentCredentials } from 'src/app/types/environment';

export const environment: EnvironmentCredentials = {
  apiUrl: 'http://127.0.0.1:5001/pip-terminal/us-central1/api',
  // appsUrl: 'apps', // `~/public/apps`
  appsUrl: 'https://raw.githubusercontent.com/CodyTolene/pip-apps/releases',
  google: {
    firebase: {
      apiKey: 'AIzaSyB7cmxC7bhxZgh7ZCQy8lfTFKyk1Uzst_o',
      appId: '1:438882577130:web:dc1124a2ab2ad5d21c0593',
      authDomain: 'pip-boy.local', // 'pip-terminal.firebaseapp.com',
      measurementId: 'G-1Z6DNZH2C2',
      messagingSenderId: '438882577130',
      projectId: 'pip-terminal',
      storageBucket: 'pip-terminal.firebasestorage.app',
    },
    recaptcha: {
      apiKey: undefined,
    },
  },
  isProduction: false,
};
