interface EnvironmentCredentials {
  /**
   * Dev: The URL to the root of the "public" folder.
   * Prod: The URL to the root of the "pip-apps" repository.
   */
  appsUrl: string;
  google: {
    firebase: import('@angular/fire/app').FirebaseOptions;
    maps: {
      apiKey: string | undefined;
    };
    recaptcha: {
      apiKey: string;
    };
  };
  isProduction: boolean;
}
