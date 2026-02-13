export interface EnvironmentCredentials {
  apiUrl: string;
  /**
   * Dev: The URL to the root of the "public" folder.
   * Prod: The URL to the root of the "pip-apps" repository.
   */
  appsUrl: string;
  google: {
    firebase: import('@angular/fire/app').FirebaseOptions;
    recaptcha: {
      apiKey: string | undefined;
    };
  };
  isProduction: boolean;
}
