import crypto from 'node:crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_samatha_boutique_123456789_very_secure';

/**
 * Hash a password using PBKDF2 with SHA-512
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verify a password against its hash and salt
 */
export function verifyPassword(password, hash, salt) {
  if (!password || !hash || !salt) return false;
  try {
    const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const a = Buffer.from(testHash, 'hex');
    const b = Buffer.from(hash, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Sign a payload into a stateless JWT token (valid for 7 days by default)
 */
export function signToken(payload, expiresInMs = 7 * 24 * 60 * 60 * 1000) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Date.now() + expiresInMs;
  const fullPayload = { ...payload, exp };

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Verify and decode a JWT token. Returns payload or null if invalid/expired.
 */
export function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signature] = parts;

  try {
    // Recompute signature to verify integrity
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    const signatureBuffer = Buffer.from(signature, 'base64url');
    const expectedBuffer = Buffer.from(expectedSignature, 'base64url');

    if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return null;
    }

    // Decode and parse payload
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));

    // Check expiration
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Token expired
    }

    return payload;
  } catch {
    return null;
  }
}
