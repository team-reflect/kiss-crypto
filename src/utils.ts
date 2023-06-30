import * as u from '@noble/hashes/utils';
import { base64 } from '@scure/base';

export const hexStringToArrayBuffer = async (hex: string): Promise<Uint8Array> => {
  return u.hexToBytes(hex)
}

export async function arrayBufferToBase64(arrayBuffer: Uint8Array): Promise<string> {
  return base64.encode(arrayBuffer)
}

export async function base64ToArrayBuffer(b64: string): Promise<Uint8Array> {
  return base64.decode(b64)
}

export async function stringToArrayBuffer(string: string): Promise<Uint8Array> {
  return u.utf8ToBytes(string)
}

export async function arrayBufferToHexString(arrayBuffer: Uint8Array): Promise<string> {
  return u.bytesToHex(arrayBuffer)
}

export async function arrayBufferToString(arrayBuffer: Uint8Array): Promise<string> {
  return new TextDecoder().decode(arrayBuffer)
}

export const generateRandomKey = async (length: number): Promise<string> => {
  const randomValues = await generateRandomUint8Array(length)
  return arrayBufferToHexString(randomValues)
}

export const generateRandomUint8Array = async (length: number): Promise<Uint8Array> => {
  return u.randomBytes(length)
}

export const concatUint8Arrays = (...arrays: Uint8Array[]): Uint8Array => {
  const totalLength = arrays.reduce((acc, array) => acc + array.length, 0)
  const result = new Uint8Array(totalLength)

  let offset = 0

  for (const array of arrays) {
    result.set(array, offset)
    offset += array.length
  }

  return result
}
