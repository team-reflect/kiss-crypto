import {bytesToHex, concatBytes, hexToBytes, utf8ToBytes} from '@noble/hashes/utils'
import {
  arrayBufferToBase64,
  arrayBufferToString,
  base64ToArrayBuffer,
  generateRandomKey,
} from './utils'
import {xchacha20_poly1305} from '@noble/ciphers/chacha'
import {sha256} from '@noble/hashes/sha256'
import {hkdf} from '@noble/hashes/hkdf'
import {argon2id} from 'hash-wasm'

export type HexString = string
export type Utf8String = string
export type Base64String = string
export type EncryptedMessage = string
export type EncryptedBlobMessage = Uint8Array

const STRING_PARTITION = ':'

export enum Defaults {
  Version = '001',
  ArgonLength = 32,
  ArgonSaltLength = 16,
  ArgonIterations = 5,
  ArgonMemLimit = 67108864,
  ArgonOutputKeyBytes = 64,
  EncryptionKeyLength = 32,
  EncryptionNonceLength = 24,
}

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

/**
 * Derives a key from a password and salt using
 * argon2id (crypto_pwhash_ALG_DEFAULT).
 * @param password - Plain text string
 * @param salt - Hex salt string (use generateSalt())
 * @returns Derived key in hex format
 */
export async function hashPassword({
  password,
  salt,
  iterations = Defaults.ArgonIterations,
  bytes = Defaults.ArgonMemLimit,
  length = Defaults.ArgonLength,
}: {
  password: Utf8String
  salt: HexString
  iterations?: number
  bytes?: number
  length?: number
}): Promise<HexString> {
  return argon2id({
    password,
    salt: hexToBytes(salt),
    iterations,
    parallelism: 1,
    memorySize: 65536,
    maxmem: bytes,
    hashLength: length,
    outputType: 'hex',
  })
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
  const arrayBuffer = xchacha20_poly1305(hexToBytes(key), hexToBytes(nonce)).encrypt(
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
  return xchacha20_poly1305(hexToBytes(key), nonceBuffer).encrypt(plainblob)
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
  const arr = xchacha20_poly1305(hexToBytes(key), hexToBytes(nonce)).decrypt(
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
  return xchacha20_poly1305(hexToBytes(key), nonceBuffer).decrypt(cipherblob)
}
