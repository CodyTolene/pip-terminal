export interface UserProfileApi {
  dateOfBirth?: string | null; // ISO 8601 date string
  disableAds?: boolean | null;
  roomNumber?: number | null;
  skill?: string | null;
  vaultNumber?: number | null;
}
