import * as admin from 'firebase-admin';

export async function getUserPhotoURL(
  uid: string,
  filename = 'images/user/user.png',
): Promise<string | null> {
  const bucket = admin.storage().bucket();
  const filePath = `accounts/${uid}/images/${filename}`;
  const file = bucket.file(filePath);

  const [exists] = await file.exists();
  if (!exists) {
    return null;
  }

  // You can sign a URL (expires) or use Firebase Storage download tokens for public URLs
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '03-01-2500', // far future
  });
  return url;
}
