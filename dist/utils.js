"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomKey = exports.arrayBufferToString = exports.base64ToArrayBuffer = exports.arrayBufferToBase64 = void 0;
var utils_1 = require("@noble/hashes/utils");
var base_1 = require("@scure/base");
function arrayBufferToBase64(arrayBuffer) {
    return base_1.base64.encode(arrayBuffer);
}
exports.arrayBufferToBase64 = arrayBufferToBase64;
function base64ToArrayBuffer(b64) {
    return base_1.base64.decode(b64);
}
exports.base64ToArrayBuffer = base64ToArrayBuffer;
function arrayBufferToString(arrayBuffer) {
    return new TextDecoder().decode(arrayBuffer);
}
exports.arrayBufferToString = arrayBufferToString;
function generateRandomKey(length) {
    var randomValues = (0, utils_1.randomBytes)(length);
    return (0, utils_1.bytesToHex)(randomValues);
}
exports.generateRandomKey = generateRandomKey;
