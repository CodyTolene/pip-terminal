interface EnvironmentCredentials {
  /** The directory to store apps in. */
  appsDir: string;
  /**
   * Dev: The URL to the root of the "public" folder.
   * Prod: The URL to the root of the "pip-apps" repository.
   */
  appsUrl: string;
  production: boolean;
  google: {
    firebase: import('@angular/fire/app').FirebaseOptions;
    maps: {
      apiKey: string;
    };
  };
}
