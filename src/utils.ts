import {
  base64_variants,
  from_base64,
  from_hex,
  from_string,
  ready,
  to_base64,
  to_hex,
  to_string,
} from './libsodium'

const BASE64_VARIANT = base64_variants.ORIGINAL

export const hexStringToArrayBuffer = async (hex: string): Promise<Uint8Array> => {
  await ready
  return from_hex(hex)
}

export async function arrayBufferToBase64(arrayBuffer: Uint8Array): Promise<string> {
  await ready
  return to_base64(arrayBuffer, BASE64_VARIANT)
}

export async function base64ToArrayBuffer(base64: string): Promise<Uint8Array> {
  await ready
  return from_base64(base64, BASE64_VARIANT)
}

export async function stringToArrayBuffer(string: string): Promise<Uint8Array> {
  await ready
  return from_string(string)
}

export async function arrayBufferToHexString(arrayBuffer: Uint8Array): Promise<string> {
  await ready
  return to_hex(arrayBuffer)
}

export async function arrayBufferToString(arrayBuffer: Uint8Array): Promise<string> {
  await ready
  return to_string(arrayBuffer)
}

export const generateRandomKey = async (length: number): Promise<string> => {
  const randomValues = await generateRandomUint8Array(length)
  return arrayBufferToHexString(randomValues)
}

export const generateRandomUint8Array = async (length: number): Promise<Uint8Array> => {
  return getRandomValues(new Uint8Array(length))
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const getRandomValues = require('get-random-values')

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
