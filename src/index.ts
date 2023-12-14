import {xchacha20poly1305} from '@noble/ciphers/chacha'
import {hkdf} from '@noble/hashes/hkdf'
import {sha256} from '@noble/hashes/sha256'
import {bytesToHex, concatBytes, hexToBytes, utf8ToBytes} from '@noble/hashes/utils'
import type {
  Base64String,
  EncryptedBlobMessage,
  EncryptedMessage,
  HexString,
  Utf8String,
} from './types.js'
import {
  arrayBufferToBase64,
  arrayBufferToString,
  base64ToArrayBuffer,
  generateRandomKey,
} from './utils.js'
import {Defaults} from './defaults.js'

export type {Base64String, EncryptedBlobMessage, EncryptedMessage, HexString, Utf8String}

const STRING_PARTITION = ':'

/**
 * Generates a random key in hex format
 * @returns A string key in hex format
 */
export function generateEncryptionKey() {
  return generateRandomKey(Defaults.EncryptionKeyLength)
}

/**
 * Generates a random key in hex format
 * @returns A string key in hex format
 */
export function generateSalt() {
  return generateRandomKey(Defaults.ArgonSaltLength)
}

/**
 * Encrypt a message (and associated data) with XChaCha20-Poly1305.
 * @param key - In hex format
 * @param plaintext
 * @returns Base64 ciphertext string
 *
 * @deprecated This function converts cipherblob to base64 string, which is not
 * efficient. Use one of the functions that return blob instead.
 */
export function encrypt({
  key,
  plaintext,
}: {
  key: HexString
  plaintext: Utf8String
}): EncryptedMessage {
  const nonce = generateRandomKey(Defaults.EncryptionNonceLength)

  const ciphertext = xChaChaEncrypt({
    key,
    plaintext,
    nonce,
  })

  return [Defaults.Version, nonce, ciphertext].join(STRING_PARTITION)
}

/**
 * Encrypt a plaintext string and output it as a Uint8Array blob.
 * @param key - The encryption key in hex format.
 * @param plaintext - The plaintext string to encrypt.
 * @returns A Promise that resolves to the encrypted message as a Uint8Array.
 */
export const encryptStringAsBlob = ({
  key,
  plaintext,
}: {
  key: HexString
  plaintext: Utf8String
}): EncryptedBlobMessage => {
  const plainblob = utf8ToBytes(plaintext)

  return encryptBlob({key, plainblob})
}

/**
 * Encrypt a message (and associated data) with XChaCha20-Poly1305.
 * @param key - In hex format
 * @param plainblob - In Uint8Array format
 * @returns Uint8Array ciphertext array
 */
export function encryptBlob({
  key,
  plainblob,
}: {
  key: HexString
  plainblob: Uint8Array
}): EncryptedBlobMessage {
  const nonce = generateRandomKey(Defaults.EncryptionNonceLength)
  const nonceBuffer = hexToBytes(nonce)

  const cipherblob = xChaChaEncryptBlob({
    key,
    plainblob,
    nonceBuffer,
  })

  const versionBuffer = utf8ToBytes(Defaults.Version)

  return concatBytes(versionBuffer, nonceBuffer, cipherblob)
}

/**
 * Decrypt a message (and associated data) with XChaCha20-Poly1305
 * @param key - In hex format
 * @param ciphertext
 * @returns Plain utf8 string or null if decryption fails
 */
export function decrypt({
  key,
  ciphertext: encryptedMessage,
}: {
  key: HexString
  ciphertext: EncryptedMessage
}): Utf8String | null {
  const [version, nonce, ciphertext] = encryptedMessage.split(STRING_PARTITION, 3)

  if (version < Defaults.Version) {
    throw new Error(`Invalid version: ${version}`)
  }

  return xChaChaDecrypt({key, ciphertext, nonce})
}

/**
 * Decrypt an encrypted blob message and output it as a plaintext string.
 * @param key - The decryption key in hex format.
 * @param cipherblob - The encrypted message as a Uint8Array.
 * @returns A Promise that resolves to the decrypted plaintext string or null if decryption fails.
 */
export const decryptBlobAsString = async ({
  key,
  cipherblob,
}: {
  key: HexString
  cipherblob: EncryptedBlobMessage
}): Promise<Utf8String | null> => {
  const decryptedBlob = await decryptBlob({key, cipherblob})

  if (!decryptedBlob) return null

  return arrayBufferToString(decryptedBlob)
}

/**
 * Decrypt a message (and associated data) with XChaCha20-Poly1305
 * @param key - In hex format
 * @param cipherblob - In Uint8Array format
 * @returns Uint8Array or null if decryption fails
 */
export function decryptBlob({
  key,
  cipherblob: encryptedMessage,
}: {
  key: HexString
  cipherblob: EncryptedBlobMessage
}): Uint8Array | null {
  const versionBuffer = encryptedMessage.slice(0, Defaults.Version.length)
  const version = arrayBufferToString(versionBuffer)

  if (version < Defaults.Version) {
    throw new Error(`Invalid version: ${version}`)
  }

  const nonceBuffer = encryptedMessage.slice(
    Defaults.Version.length,
    Defaults.Version.length + Defaults.EncryptionNonceLength,
  )

  const cipherblob = encryptedMessage.slice(
    Defaults.Version.length + Defaults.EncryptionNonceLength,
  )

  return xChaChaDecryptBlob({key, cipherblob, nonceBuffer})
}

/**
 * Securely hashes a key with a salt using HKDF-SHA256
 * @param key - Plain text string
 * @param salt - Hex salt string (use generateSalt())
 * @returns Hashed key in hex format
 */
export function hash({
  key,
  salt,
  length = 32,
}: {
  key: Utf8String
  salt: HexString
  length?: number
}): HexString {
  const result = hkdf(sha256, utf8ToBytes(key), utf8ToBytes(salt), undefined, length)
  return bytesToHex(result)
}

// Private functions

function xChaChaEncrypt({
  key,
  plaintext,
  nonce,
}: {
  key: HexString
  plaintext: Utf8String
  nonce: HexString
}): Base64String {
  if (nonce.length !== 48) throw Error('Nonce must be 24 bytes')
  const plainblob = new TextEncoder().encode(plaintext)
  const arrayBuffer = xchacha20poly1305(hexToBytes(key), hexToBytes(nonce)).encrypt(
    plainblob,
  )
  return arrayBufferToBase64(arrayBuffer)
}

function xChaChaEncryptBlob({
  key,
  plainblob,
  nonceBuffer,
}: {
  key: HexString
  plainblob: Uint8Array
  nonceBuffer: Uint8Array
}): Uint8Array {
  if (nonceBuffer.length !== 24) {
    throw Error('nonceBuffer must be 24 bytes')
  }
  return xchacha20poly1305(hexToBytes(key), nonceBuffer).encrypt(plainblob)
}

function xChaChaDecrypt({
  key,
  ciphertext,
  nonce,
}: {
  key: HexString
  ciphertext: Base64String
  nonce: HexString
}): Utf8String | null {
  const arr = xchacha20poly1305(hexToBytes(key), hexToBytes(nonce)).decrypt(
    base64ToArrayBuffer(ciphertext),
  )
  return new TextDecoder().decode(arr)
}

function xChaChaDecryptBlob({
  key,
  cipherblob,
  nonceBuffer,
}: {
  key: HexString
  cipherblob: EncryptedBlobMessage
  nonceBuffer: Uint8Array
}): Uint8Array | null {
  return xchacha20poly1305(hexToBytes(key), nonceBuffer).decrypt(cipherblob)
}
