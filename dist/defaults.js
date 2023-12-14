"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Defaults = void 0;
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
