export const USERS_SEED: readonly UserCreate[] = [
  {
    disabled: false,
    displayName: 'User - Default',
    email: 'test.1@pip-boy.local',
    emailVerified: true,
    password: 'DevUserPass000',
    phoneNumber: '+15555555555',
    photoURL: undefined,
  },
  {
    disabled: false,
    displayName: 'User - Unverified',
    email: 'test.2@pip-boy.local',
    emailVerified: false,
    phoneNumber: undefined,
    password: 'DevUserPass000',
    photoURL: undefined,
  },
  {
    disabled: true,
    displayName: 'User - Disabled',
    email: 'test.3@pip-boy.local',
    emailVerified: true,
    phoneNumber: undefined,
    password: 'DevUserPass000',
    photoURL: undefined,
  },
];
