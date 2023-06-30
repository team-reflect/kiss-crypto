import * as u from '@noble/hashes/utils'
import {base64} from '@scure/base'

export function hexStringToArrayBuffer(hex: string): Uint8Array {
  return u.hexToBytes(hex)
}

export function arrayBufferToBase64(arrayBuffer: Uint8Array): string {
  return base64.encode(arrayBuffer)
}

export function base64ToArrayBuffer(b64: string): Uint8Array {
  return base64.decode(b64)
}

export function stringToArrayBuffer(string: string): Uint8Array {
  return u.utf8ToBytes(string)
}

export function arrayBufferToHexString(arrayBuffer: Uint8Array): string {
  return u.bytesToHex(arrayBuffer)
}

export function arrayBufferToString(arrayBuffer: Uint8Array): string {
  return new TextDecoder().decode(arrayBuffer)
}

export function generateRandomKey(length: number): string {
  const randomValues = generateRandomUint8Array(length)
  return arrayBufferToHexString(randomValues)
}

export function generateRandomUint8Array(length: number): Uint8Array {
  return u.randomBytes(length)
}

export function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, array) => acc + array.length, 0)
  const result = new Uint8Array(totalLength)

  let offset = 0

  for (const array of arrays) {
    result.set(array, offset)
    offset += array.length
  }

  return result
}
