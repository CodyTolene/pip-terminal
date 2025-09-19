type UserCreate = Omit<
  import('firebase-admin/auth').CreateRequest,
  // Omit properties that have their types updated.
  'displayName' | 'email' | 'password' | 'phoneNumber'
>;

export interface UserCreateApi extends UserCreate {
  displayName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}
