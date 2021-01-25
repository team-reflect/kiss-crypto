import {
  base64_variants,
  from_base64,
  from_hex,
  from_string,
  ready,
  to_base64,
  to_hex,
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

export const generateRandomKey = async (bits: number): Promise<string> => {
  const bytes = bits / 8
  const arrayBuffer:Uint8Array = getRandomValues(new Uint8Array(bytes))
  return arrayBufferToHexString(arrayBuffer)
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const getRandomValues = require('get-random-values')
