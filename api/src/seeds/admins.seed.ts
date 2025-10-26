export const ADMINS_SEED: readonly UserSeed[] = [
  {
    native: {
      // Firebase User Auth fields
      disabled: false,
      displayName: 'Support_Admin',
      email: 'support@pip-boy.local',
      emailVerified: true,
      password: 'DevAdminPass000',
      phoneNumber: '+10005550000',
      photoURL: undefined,
    },
    profile: {
      // Extra profile fields (Firestore)
      dateOfBirth: '2000-01-01',
      disableAds: true,
      roomNumber: 88,
      skill: 'Support',
      vaultNumber: 101,
    },
  },
];
