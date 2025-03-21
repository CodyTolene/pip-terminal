interface EnvironmentCredentials {
  production: boolean;
  google: {
    firebase: import('@angular/fire/app').FirebaseOptions;
    maps: {
      apiKey: string;
    };
  };
}
