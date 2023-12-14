"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.decryptBlob = exports.decryptBlobAsString = exports.decrypt = exports.encryptBlob = exports.encryptStringAsBlob = exports.encrypt = exports.generateSalt = exports.generateEncryptionKey = void 0;
var chacha_1 = require("@noble/ciphers/chacha");
var hkdf_1 = require("@noble/hashes/hkdf");
var sha256_1 = require("@noble/hashes/sha256");
var utils_1 = require("@noble/hashes/utils");
var utils_2 = require("./utils");
var defaults_1 = require("./defaults");
var STRING_PARTITION = ':';
/**
 * Generates a random key in hex format
 * @returns A string key in hex format
 */
function generateEncryptionKey() {
    return (0, utils_2.generateRandomKey)(defaults_1.Defaults.EncryptionKeyLength);
}
exports.generateEncryptionKey = generateEncryptionKey;
/**
 * Generates a random key in hex format
 * @returns A string key in hex format
 */
function generateSalt() {
    return (0, utils_2.generateRandomKey)(defaults_1.Defaults.ArgonSaltLength);
}
exports.generateSalt = generateSalt;
/**
 * Encrypt a message (and associated data) with XChaCha20-Poly1305.
 * @param key - In hex format
 * @param plaintext
 * @returns Base64 ciphertext string
 *
 * @deprecated This function converts cipherblob to base64 string, which is not
 * efficient. Use one of the functions that return blob instead.
 */
function encrypt(_a) {
    var key = _a.key, plaintext = _a.plaintext;
    var nonce = (0, utils_2.generateRandomKey)(defaults_1.Defaults.EncryptionNonceLength);
    var ciphertext = xChaChaEncrypt({
        key: key,
        plaintext: plaintext,
        nonce: nonce,
    });
    return [defaults_1.Defaults.Version, nonce, ciphertext].join(STRING_PARTITION);
}
exports.encrypt = encrypt;
/**
 * Encrypt a plaintext string and output it as a Uint8Array blob.
 * @param key - The encryption key in hex format.
 * @param plaintext - The plaintext string to encrypt.
 * @returns A Promise that resolves to the encrypted message as a Uint8Array.
 */
var encryptStringAsBlob = function (_a) {
    var key = _a.key, plaintext = _a.plaintext;
    var plainblob = (0, utils_1.utf8ToBytes)(plaintext);
    return encryptBlob({ key: key, plainblob: plainblob });
};
exports.encryptStringAsBlob = encryptStringAsBlob;
/**
 * Encrypt a message (and associated data) with XChaCha20-Poly1305.
 * @param key - In hex format
 * @param plainblob - In Uint8Array format
 * @returns Uint8Array ciphertext array
 */
function encryptBlob(_a) {
    var key = _a.key, plainblob = _a.plainblob;
    var nonce = (0, utils_2.generateRandomKey)(defaults_1.Defaults.EncryptionNonceLength);
    var nonceBuffer = (0, utils_1.hexToBytes)(nonce);
    var cipherblob = xChaChaEncryptBlob({
        key: key,
        plainblob: plainblob,
        nonceBuffer: nonceBuffer,
    });
    var versionBuffer = (0, utils_1.utf8ToBytes)(defaults_1.Defaults.Version);
    return (0, utils_1.concatBytes)(versionBuffer, nonceBuffer, cipherblob);
}
exports.encryptBlob = encryptBlob;
/**
 * Decrypt a message (and associated data) with XChaCha20-Poly1305
 * @param key - In hex format
 * @param ciphertext
 * @returns Plain utf8 string or null if decryption fails
 */
function decrypt(_a) {
    var key = _a.key, encryptedMessage = _a.ciphertext;
    var _b = encryptedMessage.split(STRING_PARTITION, 3), version = _b[0], nonce = _b[1], ciphertext = _b[2];
    if (version < defaults_1.Defaults.Version) {
        throw new Error("Invalid version: ".concat(version));
    }
    return xChaChaDecrypt({ key: key, ciphertext: ciphertext, nonce: nonce });
}
exports.decrypt = decrypt;
/**
 * Decrypt an encrypted blob message and output it as a plaintext string.
 * @param key - The decryption key in hex format.
 * @param cipherblob - The encrypted message as a Uint8Array.
 * @returns A Promise that resolves to the decrypted plaintext string or null if decryption fails.
 */
var decryptBlobAsString = function (_a) {
    var key = _a.key, cipherblob = _a.cipherblob;
    return __awaiter(void 0, void 0, void 0, function () {
        var decryptedBlob;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, decryptBlob({ key: key, cipherblob: cipherblob })];
                case 1:
                    decryptedBlob = _b.sent();
                    if (!decryptedBlob)
                        return [2 /*return*/, null];
                    return [2 /*return*/, (0, utils_2.arrayBufferToString)(decryptedBlob)];
            }
        });
    });
};
exports.decryptBlobAsString = decryptBlobAsString;
/**
 * Decrypt a message (and associated data) with XChaCha20-Poly1305
 * @param key - In hex format
 * @param cipherblob - In Uint8Array format
 * @returns Uint8Array or null if decryption fails
 */
function decryptBlob(_a) {
    var key = _a.key, encryptedMessage = _a.cipherblob;
    var versionBuffer = encryptedMessage.slice(0, defaults_1.Defaults.Version.length);
    var version = (0, utils_2.arrayBufferToString)(versionBuffer);
    if (version < defaults_1.Defaults.Version) {
        throw new Error("Invalid version: ".concat(version));
    }
    var nonceBuffer = encryptedMessage.slice(defaults_1.Defaults.Version.length, defaults_1.Defaults.Version.length + defaults_1.Defaults.EncryptionNonceLength);
    var cipherblob = encryptedMessage.slice(defaults_1.Defaults.Version.length + defaults_1.Defaults.EncryptionNonceLength);
    return xChaChaDecryptBlob({ key: key, cipherblob: cipherblob, nonceBuffer: nonceBuffer });
}
exports.decryptBlob = decryptBlob;
/**
 * Securely hashes a key with a salt using HKDF-SHA256
 * @param key - Plain text string
 * @param salt - Hex salt string (use generateSalt())
 * @returns Hashed key in hex format
 */
function hash(_a) {
    var key = _a.key, salt = _a.salt, _b = _a.length, length = _b === void 0 ? 32 : _b;
    var result = (0, hkdf_1.hkdf)(sha256_1.sha256, (0, utils_1.utf8ToBytes)(key), (0, utils_1.utf8ToBytes)(salt), undefined, length);
    return (0, utils_1.bytesToHex)(result);
}
exports.hash = hash;
// Private functions
function xChaChaEncrypt(_a) {
    var key = _a.key, plaintext = _a.plaintext, nonce = _a.nonce;
    if (nonce.length !== 48)
        throw Error('Nonce must be 24 bytes');
    var plainblob = new TextEncoder().encode(plaintext);
    var arrayBuffer = (0, chacha_1.xchacha20poly1305)((0, utils_1.hexToBytes)(key), (0, utils_1.hexToBytes)(nonce)).encrypt(plainblob);
    return (0, utils_2.arrayBufferToBase64)(arrayBuffer);
}
function xChaChaEncryptBlob(_a) {
    var key = _a.key, plainblob = _a.plainblob, nonceBuffer = _a.nonceBuffer;
    if (nonceBuffer.length !== 24) {
        throw Error('nonceBuffer must be 24 bytes');
    }
    return (0, chacha_1.xchacha20poly1305)((0, utils_1.hexToBytes)(key), nonceBuffer).encrypt(plainblob);
}
function xChaChaDecrypt(_a) {
    var key = _a.key, ciphertext = _a.ciphertext, nonce = _a.nonce;
    var arr = (0, chacha_1.xchacha20poly1305)((0, utils_1.hexToBytes)(key), (0, utils_1.hexToBytes)(nonce)).decrypt((0, utils_2.base64ToArrayBuffer)(ciphertext));
    return new TextDecoder().decode(arr);
}
function xChaChaDecryptBlob(_a) {
    var key = _a.key, cipherblob = _a.cipherblob, nonceBuffer = _a.nonceBuffer;
    return (0, chacha_1.xchacha20poly1305)((0, utils_1.hexToBytes)(key), nonceBuffer).decrypt(cipherblob);
}
