import { bytesToHex, randomBytes } from '@noble/hashes/utils';
import { base64 } from '@scure/base';
export function arrayBufferToBase64(arrayBuffer) {
    return base64.encode(arrayBuffer);
}
export function base64ToArrayBuffer(b64) {
    return base64.decode(b64);
}
export function arrayBufferToString(arrayBuffer) {
    return new TextDecoder().decode(arrayBuffer);
}
export function generateRandomKey(length) {
    const randomValues = randomBytes(length);
    return bytesToHex(randomValues);
}
