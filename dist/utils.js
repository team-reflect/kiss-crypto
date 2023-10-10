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
exports.concatUint8Arrays = exports.getRandomValues = exports.generateRandomUint8Array = exports.generateRandomKey = exports.arrayBufferToString = exports.arrayBufferToHexString = exports.stringToArrayBuffer = exports.base64ToArrayBuffer = exports.arrayBufferToBase64 = exports.hexStringToArrayBuffer = void 0;
var libsodium_1 = require("./libsodium");
var BASE64_VARIANT = libsodium_1.base64_variants.ORIGINAL;
var hexStringToArrayBuffer = function (hex) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, libsodium_1.ready];
            case 1:
                _a.sent();
                return [2 /*return*/, (0, libsodium_1.from_hex)(hex)];
        }
    });
}); };
exports.hexStringToArrayBuffer = hexStringToArrayBuffer;
function arrayBufferToBase64(arrayBuffer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, libsodium_1.ready];
                case 1:
                    _a.sent();
                    return [2 /*return*/, (0, libsodium_1.to_base64)(arrayBuffer, BASE64_VARIANT)];
            }
        });
    });
}
exports.arrayBufferToBase64 = arrayBufferToBase64;
function base64ToArrayBuffer(base64) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, libsodium_1.ready];
                case 1:
                    _a.sent();
                    return [2 /*return*/, (0, libsodium_1.from_base64)(base64, BASE64_VARIANT)];
            }
        });
    });
}
exports.base64ToArrayBuffer = base64ToArrayBuffer;
function stringToArrayBuffer(string) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, libsodium_1.ready];
                case 1:
                    _a.sent();
                    return [2 /*return*/, (0, libsodium_1.from_string)(string)];
            }
        });
    });
}
exports.stringToArrayBuffer = stringToArrayBuffer;
function arrayBufferToHexString(arrayBuffer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, libsodium_1.ready];
                case 1:
                    _a.sent();
                    return [2 /*return*/, (0, libsodium_1.to_hex)(arrayBuffer)];
            }
        });
    });
}
exports.arrayBufferToHexString = arrayBufferToHexString;
function arrayBufferToString(arrayBuffer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, libsodium_1.ready];
                case 1:
                    _a.sent();
                    return [2 /*return*/, (0, libsodium_1.to_string)(arrayBuffer)];
            }
        });
    });
}
exports.arrayBufferToString = arrayBufferToString;
var generateRandomKey = function (length) { return __awaiter(void 0, void 0, void 0, function () {
    var randomValues;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.generateRandomUint8Array)(length)];
            case 1:
                randomValues = _a.sent();
                return [2 /*return*/, arrayBufferToHexString(randomValues)];
        }
    });
}); };
exports.generateRandomKey = generateRandomKey;
var generateRandomUint8Array = function (length) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, exports.getRandomValues)(new Uint8Array(length))];
    });
}); };
exports.generateRandomUint8Array = generateRandomUint8Array;
// eslint-disable-next-line @typescript-eslint/no-var-requires
exports.getRandomValues = require('get-random-values');
var concatUint8Arrays = function () {
    var arrays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrays[_i] = arguments[_i];
    }
    var totalLength = arrays.reduce(function (acc, array) { return acc + array.length; }, 0);
    var result = new Uint8Array(totalLength);
    var offset = 0;
    for (var _a = 0, arrays_1 = arrays; _a < arrays_1.length; _a++) {
        var array = arrays_1[_a];
        result.set(array, offset);
        offset += array.length;
    }
    return result;
};
exports.concatUint8Arrays = concatUint8Arrays;
