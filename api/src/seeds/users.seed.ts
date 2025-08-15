export const USERS_SEED: readonly UserCreate[] = [
  {
    displayName: 'User - Default',
    email: 'test.1@pip-boy.local',
    emailVerified: true,
    password: 'DevUserPass000',
    phoneNumber: '1-555-555-5555',
    photoURL: 'images/user/user.png',
  },
  {
    displayName: 'User - Unverified',
    email: 'test.2@pip-boy.local',
    emailVerified: false,
    password: 'DevUserPass000',
  },
  {
    disabled: true,
    displayName: 'User - Disabled',
    email: 'test.3@pip-boy.local',
    emailVerified: true,
    password: 'DevUserPass000',
  },
];
