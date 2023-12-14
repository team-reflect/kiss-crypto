import {bytesToHex, randomBytes} from '@noble/hashes/utils'
import {base64} from '@scure/base'

export function arrayBufferToBase64(arrayBuffer: Uint8Array): string {
  return base64.encode(arrayBuffer)
}

export function base64ToArrayBuffer(b64: string): Uint8Array {
  return base64.decode(b64)
}

export function arrayBufferToString(arrayBuffer: Uint8Array): string {
  return new TextDecoder().decode(arrayBuffer)
}

export function generateRandomKey(length: number): string {
  const randomValues = randomBytes(length)
  return bytesToHex(randomValues)
}
