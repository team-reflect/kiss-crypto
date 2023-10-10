export type HexString = string;
export type Utf8String = string;
export type Base64String = string;
export type EncryptedMessage = string;
export type EncryptedBlobMessage = Uint8Array;
export declare enum Defaults {
    Version = "001",
    ArgonLength = 32,
    ArgonSaltLength = 16,
    ArgonIterations = 5,
    ArgonMemLimit = 67108864,
    ArgonOutputKeyBytes = 64,
    EncryptionKeyLength = 32,
    EncryptionNonceLength = 24
}
/**
 * Generates a random key in hex format
 * @returns A string key in hex format
 */
export declare function generateEncryptionKey(): string;
/**
 * Generates a random key in hex format
 * @returns A string key in hex format
 */
export declare function generateSalt(): string;
/**
 * Encrypt a message (and associated data) with XChaCha20-Poly1305.
 * @param key - In hex format
 * @param plaintext
 * @returns Base64 ciphertext string
 *
 * @deprecated This function converts cipherblob to base64 string, which is not
 * efficient. Use one of the functions that return blob instead.
 */
export declare function encrypt({ key, plaintext, }: {
    key: HexString;
    plaintext: Utf8String;
}): EncryptedMessage;
/**
 * Encrypt a plaintext string and output it as a Uint8Array blob.
 * @param key - The encryption key in hex format.
 * @param plaintext - The plaintext string to encrypt.
 * @returns A Promise that resolves to the encrypted message as a Uint8Array.
 */
export declare const encryptStringAsBlob: ({ key, plaintext, }: {
    key: HexString;
    plaintext: Utf8String;
}) => Promise<EncryptedBlobMessage>;
/**
 * Encrypt a message (and associated data) with XChaCha20-Poly1305.
 * @param key - In hex format
 * @param plainblob - In Uint8Array format
 * @returns Uint8Array ciphertext array
 */
export declare function encryptBlob({ key, plainblob, }: {
    key: HexString;
    plainblob: Uint8Array;
}): EncryptedBlobMessage;
/**
 * Decrypt a message (and associated data) with XChaCha20-Poly1305
 * @param key - In hex format
 * @param ciphertext
 * @returns Plain utf8 string or null if decryption fails
 */
export declare function decrypt({ key, ciphertext: encryptedMessage, }: {
    key: HexString;
    ciphertext: EncryptedMessage;
}): Utf8String | null;
/**
 * Decrypt an encrypted blob message and output it as a plaintext string.
 * @param key - The decryption key in hex format.
 * @param cipherblob - The encrypted message as a Uint8Array.
 * @returns A Promise that resolves to the decrypted plaintext string or null if decryption fails.
 */
export declare const decryptBlobAsString: ({ key, cipherblob, }: {
    key: HexString;
    cipherblob: EncryptedBlobMessage;
}) => Promise<Utf8String | null>;
/**
 * Decrypt a message (and associated data) with XChaCha20-Poly1305
 * @param key - In hex format
 * @param cipherblob - In Uint8Array format
 * @returns Uint8Array or null if decryption fails
 */
export declare function decryptBlob({ key, cipherblob: encryptedMessage, }: {
    key: HexString;
    cipherblob: EncryptedBlobMessage;
}): Uint8Array | null;
/**
 * Securely hashes a key with a salt using HKDF-SHA256
 * @param key - Plain text string
 * @param salt - Hex salt string (use generateSalt())
 * @returns Hashed key in hex format
 */
export declare function hash({ key, salt, length, }: {
    key: Utf8String;
    salt: HexString;
    length?: number;
}): HexString;
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
