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
exports.hashPassword = exports.hash = exports.decryptBlob = exports.decryptBlobAsString = exports.decrypt = exports.encryptBlob = exports.encryptStringAsBlob = exports.encrypt = exports.generateSalt = exports.generateEncryptionKey = exports.Defaults = void 0;
var sha256 = require("fast-sha256");
var sodium = require("./libsodium");
var utils_1 = require("./utils");
var STRING_PARTITION = ':';
var Defaults;
(function (Defaults) {
    Defaults["Version"] = "001";
    Defaults[Defaults["ArgonLength"] = 32] = "ArgonLength";
    Defaults[Defaults["ArgonSaltLength"] = 16] = "ArgonSaltLength";
    Defaults[Defaults["ArgonIterations"] = 5] = "ArgonIterations";
    Defaults[Defaults["ArgonMemLimit"] = 67108864] = "ArgonMemLimit";
    Defaults[Defaults["ArgonOutputKeyBytes"] = 64] = "ArgonOutputKeyBytes";
    Defaults[Defaults["EncryptionKeyLength"] = 32] = "EncryptionKeyLength";
    Defaults[Defaults["EncryptionNonceLength"] = 24] = "EncryptionNonceLength";
})(Defaults || (exports.Defaults = Defaults = {}));
/**
 * Generates a random key in hex format
 * @returns A string key in hex format
 */
var generateEncryptionKey = function () {
    return (0, utils_1.generateRandomKey)(Defaults.EncryptionKeyLength);
};
exports.generateEncryptionKey = generateEncryptionKey;
/**
 * Generates a random key in hex format
 * @returns A string key in hex format
 */
var generateSalt = function () {
    return (0, utils_1.generateRandomKey)(Defaults.ArgonSaltLength);
};
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
var encrypt = function (_a) {
    var key = _a.key, plaintext = _a.plaintext;
    return __awaiter(void 0, void 0, void 0, function () {
        var nonce, ciphertext;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, utils_1.generateRandomKey)(Defaults.EncryptionNonceLength)];
                case 1:
                    nonce = _b.sent();
                    return [4 /*yield*/, xChaChaEncrypt({
                            key: key,
                            plaintext: plaintext,
                            nonce: nonce,
                        })];
                case 2:
                    ciphertext = _b.sent();
                    return [2 /*return*/, [Defaults.Version, nonce, ciphertext].join(STRING_PARTITION)];
            }
        });
    });
};
exports.encrypt = encrypt;
/**
 * Encrypt a plaintext string and output it as a Uint8Array blob.
 * @param key - The encryption key in hex format.
 * @param plaintext - The plaintext string to encrypt.
 * @returns A Promise that resolves to the encrypted message as a Uint8Array.
 */
var encryptStringAsBlob = function (_a) {
    var key = _a.key, plaintext = _a.plaintext;
    return __awaiter(void 0, void 0, void 0, function () {
        var plainblob;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, utils_1.stringToArrayBuffer)(plaintext)];
                case 1:
                    plainblob = _b.sent();
                    return [2 /*return*/, (0, exports.encryptBlob)({ key: key, plainblob: plainblob })];
            }
        });
    });
};
exports.encryptStringAsBlob = encryptStringAsBlob;
/**
 * Encrypt a message (and associated data) with XChaCha20-Poly1305.
 * @param key - In hex format
 * @param plainblob - In Uint8Array format
 * @returns Uint8Array ciphertext array
 */
var encryptBlob = function (_a) {
    var key = _a.key, plainblob = _a.plainblob;
    return __awaiter(void 0, void 0, void 0, function () {
        var nonce, nonceBuffer, cipherblob, versionBuffer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, utils_1.generateRandomKey)(Defaults.EncryptionNonceLength)];
                case 1:
                    nonce = _b.sent();
                    return [4 /*yield*/, (0, utils_1.hexStringToArrayBuffer)(nonce)];
                case 2:
                    nonceBuffer = _b.sent();
                    return [4 /*yield*/, xChaChaEncryptBlob({
                            key: key,
                            plainblob: plainblob,
                            nonceBuffer: nonceBuffer,
                        })];
                case 3:
                    cipherblob = _b.sent();
                    return [4 /*yield*/, (0, utils_1.stringToArrayBuffer)(Defaults.Version)];
                case 4:
                    versionBuffer = _b.sent();
                    return [2 /*return*/, (0, utils_1.concatUint8Arrays)(versionBuffer, nonceBuffer, cipherblob)];
            }
        });
    });
};
exports.encryptBlob = encryptBlob;
/**
 * Decrypt a message (and associated data) with XChaCha20-Poly1305
 * @param key - In hex format
 * @param ciphertext
 * @returns Plain utf8 string or null if decryption fails
 */
var decrypt = function (_a) {
    var key = _a.key, encryptedMessage = _a.ciphertext;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, version, nonce, ciphertext;
        return __generator(this, function (_c) {
            _b = encryptedMessage.split(STRING_PARTITION, 3), version = _b[0], nonce = _b[1], ciphertext = _b[2];
            if (version < Defaults.Version) {
                throw new Error("Invalid version: ".concat(version));
            }
            return [2 /*return*/, xChaChaDecrypt({ key: key, ciphertext: ciphertext, nonce: nonce })];
        });
    });
};
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
                case 0: return [4 /*yield*/, (0, exports.decryptBlob)({ key: key, cipherblob: cipherblob })];
                case 1:
                    decryptedBlob = _b.sent();
                    if (!decryptedBlob)
                        return [2 /*return*/, null];
                    return [2 /*return*/, (0, utils_1.arrayBufferToString)(decryptedBlob)];
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
var decryptBlob = function (_a) {
    var key = _a.key, encryptedMessage = _a.cipherblob;
    return __awaiter(void 0, void 0, void 0, function () {
        var versionBuffer, version, nonceBuffer, cipherblob;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    versionBuffer = encryptedMessage.slice(0, Defaults.Version.length);
                    return [4 /*yield*/, (0, utils_1.arrayBufferToString)(versionBuffer)];
                case 1:
                    version = _b.sent();
                    if (version < Defaults.Version) {
                        throw new Error("Invalid version: ".concat(version));
                    }
                    nonceBuffer = encryptedMessage.slice(Defaults.Version.length, Defaults.Version.length + Defaults.EncryptionNonceLength);
                    cipherblob = encryptedMessage.slice(Defaults.Version.length + Defaults.EncryptionNonceLength);
                    return [2 /*return*/, xChaChaDecryptBlob({ key: key, cipherblob: cipherblob, nonceBuffer: nonceBuffer })];
            }
        });
    });
};
exports.decryptBlob = decryptBlob;
/**
 * Securely hashes a key with a salt using HKDF-SHA256
 * @param key - Plain text string
 * @param salt - Hex salt string (use generateSalt())
 * @returns Hashed key in hex format
 */
var hash = function (_a) {
    var key = _a.key, salt = _a.salt, _b = _a.length, length = _b === void 0 ? undefined : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var result, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _d = (_c = sha256).hkdf;
                    return [4 /*yield*/, (0, utils_1.stringToArrayBuffer)(key)];
                case 1:
                    _e = [_f.sent()];
                    return [4 /*yield*/, (0, utils_1.stringToArrayBuffer)(salt)];
                case 2:
                    result = _d.apply(_c, _e.concat([_f.sent(), undefined,
                        length]));
                    return [2 /*return*/, (0, utils_1.arrayBufferToHexString)(result)];
            }
        });
    });
};
exports.hash = hash;
/**
 * Derives a key from a password and salt using
 * argon2id (crypto_pwhash_ALG_DEFAULT).
 * @param password - Plain text string
 * @param salt - Hex salt string (use generateSalt())
 * @returns Derived key in hex format
 */
var hashPassword = function (_a) {
    var password = _a.password, salt = _a.salt, _b = _a.iterations, iterations = _b === void 0 ? Defaults.ArgonIterations : _b, _c = _a.bytes, bytes = _c === void 0 ? Defaults.ArgonMemLimit : _c, _d = _a.length, length = _d === void 0 ? Defaults.ArgonLength : _d;
    return __awaiter(void 0, void 0, void 0, function () {
        var result, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, sodium.ready];
                case 1:
                    _h.sent();
                    _f = (_e = sodium).crypto_pwhash;
                    _g = [length];
                    return [4 /*yield*/, (0, utils_1.stringToArrayBuffer)(password)];
                case 2:
                    _g = _g.concat([_h.sent()]);
                    return [4 /*yield*/, (0, utils_1.hexStringToArrayBuffer)(salt)];
                case 3:
                    result = _f.apply(_e, _g.concat([_h.sent(), iterations,
                        bytes,
                        sodium.crypto_pwhash_ALG_DEFAULT,
                        'hex']));
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.hashPassword = hashPassword;
// Private functions
var xChaChaEncrypt = function (_a) {
    var key = _a.key, plaintext = _a.plaintext, nonce = _a.nonce;
    return __awaiter(void 0, void 0, void 0, function () {
        var arrayBuffer, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, sodium.ready];
                case 1:
                    _e.sent();
                    if (nonce.length !== 48) {
                        throw Error('Nonce must be 48 bytes');
                    }
                    _c = (_b = sodium).crypto_aead_xchacha20poly1305_ietf_encrypt;
                    _d = [plaintext,
                        null,
                        null];
                    return [4 /*yield*/, (0, utils_1.hexStringToArrayBuffer)(nonce)];
                case 2:
                    _d = _d.concat([_e.sent()]);
                    return [4 /*yield*/, (0, utils_1.hexStringToArrayBuffer)(key)];
                case 3:
                    arrayBuffer = _c.apply(_b, _d.concat([_e.sent()]));
                    return [2 /*return*/, (0, utils_1.arrayBufferToBase64)(arrayBuffer)];
            }
        });
    });
};
var xChaChaEncryptBlob = function (_a) {
    var key = _a.key, plainblob = _a.plainblob, nonceBuffer = _a.nonceBuffer;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, sodium.ready];
                case 1:
                    _e.sent();
                    if (nonceBuffer.length !== 24) {
                        throw Error('nonceBuffer must be 24 bytes');
                    }
                    _c = (_b = sodium).crypto_aead_xchacha20poly1305_ietf_encrypt;
                    _d = [plainblob,
                        null,
                        null,
                        nonceBuffer];
                    return [4 /*yield*/, (0, utils_1.hexStringToArrayBuffer)(key)];
                case 2: return [2 /*return*/, _c.apply(_b, _d.concat([_e.sent()]))];
            }
        });
    });
};
var xChaChaDecrypt = function (_a) {
    var key = _a.key, ciphertext = _a.ciphertext, nonce = _a.nonce;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, sodium.ready];
                case 1:
                    _e.sent();
                    _c = (_b = sodium).crypto_aead_xchacha20poly1305_ietf_decrypt;
                    _d = [null];
                    return [4 /*yield*/, (0, utils_1.base64ToArrayBuffer)(ciphertext)];
                case 2:
                    _d = _d.concat([_e.sent(), null]);
                    return [4 /*yield*/, (0, utils_1.hexStringToArrayBuffer)(nonce)];
                case 3:
                    _d = _d.concat([_e.sent()]);
                    return [4 /*yield*/, (0, utils_1.hexStringToArrayBuffer)(key)];
                case 4: return [2 /*return*/, _c.apply(_b, _d.concat([_e.sent(), 'text']))];
            }
        });
    });
};
var xChaChaDecryptBlob = function (_a) {
    var key = _a.key, cipherblob = _a.cipherblob, nonceBuffer = _a.nonceBuffer;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, sodium.ready];
                case 1:
                    _e.sent();
                    _c = (_b = sodium).crypto_aead_xchacha20poly1305_ietf_decrypt;
                    _d = [null,
                        cipherblob,
                        null,
                        nonceBuffer];
                    return [4 /*yield*/, (0, utils_1.hexStringToArrayBuffer)(key)];
                case 2: return [2 /*return*/, _c.apply(_b, _d.concat([_e.sent(), 'uint8array']))];
            }
        });
    });
};
