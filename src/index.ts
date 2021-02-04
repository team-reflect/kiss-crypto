import * as sodium from './libsodium'
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  generateRandomKey,
  hexStringToArrayBuffer,
  stringToArrayBuffer
} from './utils'

export type HexString = string
export type Utf8String = string
export type Base64String = string
export type EncryptedMessage = string

const PARTITION = ':'

export enum Defaults {
  Version = '001',
  ArgonLength = 32,
  ArgonSaltLength = 128,
  ArgonIterations = 5,
  ArgonMemLimit = 67108864,
  ArgonOutputKeyBytes = 64,
  EncryptionKeyLength = 256,
  EncryptionNonceLength = 192,
}

/**
 * Generates a random key in hex format
 * @returns A string key in hex format
 */
export const generateEncryptionKey = () => {
  return generateRandomKey(Defaults.EncryptionKeyLength)
}

/**
 * Generates a random key in hex format
 * @returns A string key in hex format
 */
export const generateSalt = () => {
  return generateRandomKey(Defaults.ArgonSaltLength)
}

/**
 * Encrypt a message (and associated data) with XChaCha20-Poly1305.
 * @param key - In hex format
 * @param plaintext
 * @returns Base64 ciphertext string
 */
export const encrypt = async ({
  key,
  plaintext,
}: {
  key: HexString,
  plaintext: Utf8String,
}): Promise<EncryptedMessage> => {
  const nonce = await generateRandomKey(
    Defaults.EncryptionNonceLength
  )

  const ciphertext = await xChaChaEncrypt({
    key, plaintext, nonce
  })

  return [
    Defaults.Version,
    nonce,
    ciphertext
  ].join(PARTITION)
}

/**
 * Decrypt a message (and associated data) with XChaCha20-Poly1305
 * @param key - In hex format
 * @param ciphertext
 * @returns Plain utf8 string or null if decryption fails
 */
export const decrypt = async ({
  key,
  ciphertext: encryptedMessage
}: {
  key: HexString,
  ciphertext: EncryptedMessage,
}): Promise<Utf8String | null> => {
  const [
    version,
    nonce,
    ciphertext
  ] = encryptedMessage.split(PARTITION, 3)

  if (version < Defaults.Version) {
    throw new Error(`Invalid version: ${version}`)
  }

  return xChaChaDecrypt({key, ciphertext, nonce})
}

/**
 * Derives a key from a password and salt using
 * argon2id (crypto_pwhash_ALG_DEFAULT).
 * @param password - Plain text string
 * @param salt - Hex salt string (use generateSalt())
 * @returns Derived key in hex format
 */
export const hashPassword = async ({
  password,
  salt,
  iterations = Defaults.ArgonIterations,
  bytes = Defaults.ArgonMemLimit,
  length = Defaults.ArgonLength,
}: {
  password: Utf8String,
  salt: HexString,
  iterations?: number,
  bytes?: number,
  length?: number
}): Promise<HexString> => {
  await sodium.ready

  const result = sodium.crypto_pwhash(
    length,
    await stringToArrayBuffer(password),
    await hexStringToArrayBuffer(salt),
    iterations,
    bytes,
    sodium.crypto_pwhash_ALG_DEFAULT,
    'hex'
  )
  return result
}


// Private functions

const xChaChaEncrypt = async ({
  key,
  plaintext,
  nonce
}: {
  key: HexString,
  plaintext: Utf8String,
  nonce: HexString,
}): Promise<Base64String> => {
  await sodium.ready

  if (nonce.length !== 48) {
    throw Error('Nonce must be 48 bytes')
  }

  const arrayBuffer = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    plaintext,
    null,
    null,
    await hexStringToArrayBuffer(nonce),
    await hexStringToArrayBuffer(key)
  )

  return arrayBufferToBase64(arrayBuffer)
}

const xChaChaDecrypt = async ({
  key, ciphertext, nonce
}: {
  key: HexString,
  ciphertext: Base64String,
  nonce: HexString,
}): Promise<Utf8String | null> => {
  await sodium.ready

  return sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
    null,
    await base64ToArrayBuffer(ciphertext),
    null,
    await hexStringToArrayBuffer(nonce),
    await hexStringToArrayBuffer(key),
    'text'
  )
}


