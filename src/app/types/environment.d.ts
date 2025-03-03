interface EnvironmentCredentials {
  production: boolean;
  google: {
    firebase: {
      projectId: string;
      appId: string;
      storageBucket: string;
      apiKey: string;
      authDomain: string;
      messagingSenderId: string;
      measurementId: string;
    };
    maps: {
      apiKey: string;
    };
  };
}
