import { hexToBytes } from '@noble/hashes/utils'
import { argon2id } from 'hash-wasm'

import * as Defaults from './defaults.js'
import type { HexString, Utf8String } from './types.js'

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
  return await argon2id({
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
