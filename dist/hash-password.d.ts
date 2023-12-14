import { HexString, Utf8String } from './types';
/**
 * Derives a key from a password and salt using
 * argon2id (crypto_pwhash_ALG_DEFAULT).
 * @param password - Plain text string
 * @param salt - Hex salt string (use generateSalt())
 * @returns Derived key in hex format
 */
export declare function hashPassword({ password, salt, iterations, bytes, length, }: {
    password: Utf8String;
    salt: HexString;
    iterations?: number;
    bytes?: number;
    length?: number;
}): Promise<HexString>;
