import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

function buildDownloadURL(
  bucketName: string,
  objectPath: string,
  token: string,
  useEmulator = false,
): string {
  const encoded = encodeURIComponent(objectPath);
  if (useEmulator) {
    // Storage emulator URL
    const host = process.env.FIREBASE_STORAGE_EMULATOR_HOST || '127.0.0.1:9199';
    return `http://${host}/v0/b/${bucketName}/o/${encoded}?alt=media&token=${token}`;
  }
  // Prod URL
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media&token=${token}`;
}

export async function setUserPhoto(
  uid: string,
  fileBuffer: Buffer,
  contentType = 'image/png',
  filename = 'profile.png',
): Promise<string> {
  const bucket = admin.storage().bucket();
  const path = `users/${uid}/images/${filename}`;
  const token = uuidv4();

  await bucket.file(path).save(fileBuffer, {
    resumable: false,
    metadata: {
      cacheControl: 'public, max-age=31536000, immutable',
      contentType,
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  const useEmu = !!process.env.FIREBASE_STORAGE_EMULATOR_HOST;
  const url = buildDownloadURL(bucket.name, path, token, useEmu);

  await admin.auth().updateUser(uid, { photoURL: url });
  return url;
}
