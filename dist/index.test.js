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
var _1 = require(".");
var utils_1 = require("./utils");
it('encrypts/decrypts plaintext', function () {
    return __awaiter(this, void 0, void 0, function () {
        var key, plaintext, ciphertext, decrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, _1.generateEncryptionKey)()];
                case 1:
                    key = _a.sent();
                    plaintext = 'hello world';
                    return [4 /*yield*/, (0, _1.encrypt)({
                            plaintext: plaintext,
                            key: key,
                        })];
                case 2:
                    ciphertext = _a.sent();
                    return [4 /*yield*/, (0, _1.decrypt)({
                            ciphertext: ciphertext,
                            key: key,
                        })];
                case 3:
                    decrypted = _a.sent();
                    expect(decrypted).toEqual(plaintext);
                    return [2 /*return*/];
            }
        });
    });
});
it('encrypts/decrypts blobs', function () {
    return __awaiter(this, void 0, void 0, function () {
        var key, plaintext, plainblob, cipherblob, decrypted, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, _1.generateEncryptionKey)()];
                case 1:
                    key = _b.sent();
                    plaintext = 'hello world';
                    return [4 /*yield*/, (0, utils_1.stringToArrayBuffer)(plaintext)];
                case 2:
                    plainblob = _b.sent();
                    return [4 /*yield*/, (0, _1.encryptBlob)({
                            plainblob: plainblob,
                            key: key,
                        })];
                case 3:
                    cipherblob = _b.sent();
                    return [4 /*yield*/, (0, _1.decryptBlob)({
                            cipherblob: cipherblob,
                            key: key,
                        })];
                case 4:
                    decrypted = _b.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, utils_1.arrayBufferToString)(decrypted)];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toEqual(plaintext);
                    return [2 /*return*/];
            }
        });
    });
});
it('hashes a password', function () {
    return __awaiter(this, void 0, void 0, function () {
        var password, salt, hash1, hash2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    password = 'password1';
                    return [4 /*yield*/, (0, _1.generateSalt)()];
                case 1:
                    salt = _a.sent();
                    return [4 /*yield*/, (0, _1.hashPassword)({ password: password, salt: salt })];
                case 2:
                    hash1 = _a.sent();
                    expect(hash1.length).toEqual(64);
                    return [4 /*yield*/, (0, _1.hashPassword)({ password: password, salt: salt })];
                case 3:
                    hash2 = _a.sent();
                    expect(hash1).toEqual(hash2);
                    return [2 /*return*/];
            }
        });
    });
});
it('sanity checks password hashes', function () {
    return __awaiter(this, void 0, void 0, function () {
        var password, salt, hash1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    password = 'password1';
                    salt = 'cfebdb6da2d9167786c83cce87963692';
                    return [4 /*yield*/, (0, _1.hashPassword)({ password: password, salt: salt })];
                case 1:
                    hash1 = _a.sent();
                    expect(hash1).toMatchInlineSnapshot('"29057df69d9940bab07be1afb4c9f1867addff3f092591f23b50152b63bcdf86"');
                    return [2 /*return*/];
            }
        });
    });
});
it('hashes a key', function () {
    return __awaiter(this, void 0, void 0, function () {
        var key, salt, hash1, hash2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = 'key1';
                    return [4 /*yield*/, (0, _1.generateSalt)()];
                case 1:
                    salt = _a.sent();
                    return [4 /*yield*/, (0, _1.hash)({ key: key, salt: salt })];
                case 2:
                    hash1 = _a.sent();
                    return [4 /*yield*/, (0, _1.hash)({ key: key, salt: salt })];
                case 3:
                    hash2 = _a.sent();
                    expect(hash1).toEqual(hash2);
                    return [2 /*return*/];
            }
        });
    });
});
it('sanity checks hashes', function () {
    return __awaiter(this, void 0, void 0, function () {
        var key, salt, hash1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = 'key1';
                    salt = '04450d2470c9d3e63259da24f4cddb7e';
                    return [4 /*yield*/, (0, _1.hash)({ key: key, salt: salt })];
                case 1:
                    hash1 = _a.sent();
                    expect(hash1).toMatchInlineSnapshot('"c61ba75858ee4507e940d18a00d05d655919e1d71b6166e5e86c405828cda2de"');
                    return [2 /*return*/];
            }
        });
    });
});
it('encrypts with hashed password', function () {
    return __awaiter(this, void 0, void 0, function () {
        var password, salt, key, plaintext, ciphertext, decrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    password = 'password1';
                    return [4 /*yield*/, (0, _1.generateSalt)()];
                case 1:
                    salt = _a.sent();
                    return [4 /*yield*/, (0, _1.hashPassword)({ password: password, salt: salt })];
                case 2:
                    key = _a.sent();
                    plaintext = 'hello world';
                    return [4 /*yield*/, (0, _1.encrypt)({
                            plaintext: plaintext,
                            key: key,
                        })];
                case 3:
                    ciphertext = _a.sent();
                    return [4 /*yield*/, (0, _1.decrypt)({
                            ciphertext: ciphertext,
                            key: key,
                        })];
                case 4:
                    decrypted = _a.sent();
                    expect(decrypted).toEqual(plaintext);
                    return [2 /*return*/];
            }
        });
    });
});
it('sanity checks v001 ciphertext', function () {
    return __awaiter(this, void 0, void 0, function () {
        var plaintext, ciphertext, key, decrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plaintext = 'hello world';
                    ciphertext = '001:a1caba8a0ff627c4f85d1134a8b69b7e4ede04c0a11c0fe6:6DIAXgI6sFceb8UZWDY7HYcRQ44opn3LTmQo';
                    key = '513fe9f410236db712a710ae8ab13bd94178fe645f3525756ebf92232a7906cf';
                    return [4 /*yield*/, (0, _1.decrypt)({
                            ciphertext: ciphertext,
                            key: key,
                        })];
                case 1:
                    decrypted = _a.sent();
                    expect(decrypted).toEqual(plaintext);
                    return [2 /*return*/];
            }
        });
    });
});
