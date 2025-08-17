type UserCreate = Omit<
  import('firebase-admin/auth').CreateRequest,
  // Omit properties that have their types updated.
  'displayName' | 'email' | 'password' | 'phoneNumber'
> & {
  /** The user's display name. */
  displayName: string;
  /** The user's primary email. */
  email: string;
  /** The user's unhashed password. */
  password: string;
  /**
   * The user's primary phone number.
   *
   * Must be a unique, non-empty [E.164](https://en.wikipedia.org/wiki/E.164)
   * standard-compliant identifier string.
   *
   * @example "+15555555555"
   */
  phoneNumber?: import('firebase-admin/auth').CreateRequest['phoneNumber'];
};
