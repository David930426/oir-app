// src/lib/jwt.ts
import { SignJWT, jwtVerify, importPKCS8, importSPKI } from 'jose';
import { AuthPayload } from '@/types/payload';

/**
 * 1. SIGN TOKEN (The "Encrypt" equivalent for Auth)
 * Uses the PRIVATE KEY to create a secure, tamper-proof login token.
 * Call this ONLY from your Login API route.
 */
export async function signAuthToken(payload: AuthPayload): Promise<string> {
  try {
    const privateKeyString = process.env.PRIVATE_KEY!;
    const privateKey = await importPKCS8(privateKeyString, 'RS256');

    const token = await new SignJWT(payload as any)
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(privateKey);

    return token;
  } catch (error) {
    console.error("Error signing auth token:", error);
    throw new Error("Could not generate login token.");
  }
}

/**
 * 2. VERIFY TOKEN (The "Decrypt" equivalent for Auth)
 * Uses the PUBLIC KEY to prove the token is real and hasn't been changed.
 * Call this from Middleware or your Data Access Layer (DAL).
 */
export async function verifyAuthToken(token: string): Promise<AuthPayload | null> {
  try {
    const publicKeyString = process.env.PUBLIC_KEY!;
    // importSPKI is used for Public Keys
    const publicKey = await importSPKI(publicKeyString, 'RS256');

    const { payload } = await jwtVerify(token, publicKey);
    
    // Return the data inside the token if the math checks out
    return payload as unknown as AuthPayload;
  } catch (error) {
    // If the token is expired, forged, or missing, we return null
    // We don't throw an error here so your middleware can gracefully redirect the user
    return null; 
  }
}