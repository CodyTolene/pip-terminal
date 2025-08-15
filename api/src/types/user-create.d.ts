type UserCreate = Omit<
  import('firebase-admin/auth').CreateRequest,
  // Omit properties that have their types updated.
  'displayName' | 'email' | 'password'
> & {
  displayName: string;
  email: string;
  password: string;
};
