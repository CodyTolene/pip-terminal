export const USERS_SEED: readonly UserSeed[] = [
  {
    native: {
      // Firebase User Auth fields
      disabled: false,
      displayName: 'User - Default',
      email: 'test.1@pip-boy.local',
      emailVerified: true,
      password: 'DevUserPass000',
      phoneNumber: '+15555555555',
      photoURL: undefined,
    },
    profile: {
      // Extra profile fields (Firestore)
      dateOfBirth: '2000-01-01', // JS Date
      roomNumber: 1,
      skill: 'Exploring',
      vaultNumber: 2,
    },
  },
  {
    native: {
      // Firebase User Auth fields
      disabled: false,
      displayName: 'User - Unverified',
      email: 'test.2@pip-boy.local',
      emailVerified: false,
      phoneNumber: undefined,
      password: 'DevUserPass000',
      photoURL: undefined,
    },
    profile: {
      // Extra profile fields (Firestore)
      dateOfBirth: '2000-01-01T00:00:00.000-05:00', // ISO 8601 string
      roomNumber: 3,
      skill: 'Adventuring',
      vaultNumber: 4,
    },
  },
  {
    native: {
      // Firebase User Auth fields
      disabled: true,
      displayName: 'User - Disabled',
      email: 'test.3@pip-boy.local',
      emailVerified: true,
      phoneNumber: undefined,
      password: 'DevUserPass000',
      photoURL: undefined,
    },
    profile: {
      // Extra profile fields (Firestore)
      // All NULL for testing
      dateOfBirth: null,
      roomNumber: null,
      skill: null,
      vaultNumber: null,
    },
  },
  {
    native: {
      // Firebase User Auth fields
      disabled: false,
      displayName: 'User - No Profile',
      email: 'test.4@pip-boy.local',
      emailVerified: true,
      phoneNumber: undefined,
      password: 'DevUserPass000',
      photoURL: undefined,
    },
    profile: {
      // Extra profile fields (Firestore)
      // All undefined for testing
    },
  },
];
