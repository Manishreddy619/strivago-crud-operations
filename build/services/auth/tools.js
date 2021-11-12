"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAuthenticate = exports.verifyJWT = void 0;
var tslib_1 = require("tslib");
var jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
var generateJwt = function (payload) {
    return new Promise(function (resove, reject) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "1 week" }, function (err, token) {
            if (err)
                reject(err);
            else
                resove(token);
        });
    });
};
var verifyJWT = function (token) {
    return new Promise(function (res, rej) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err)
                rej(err);
            else
                res(decodedToken);
        });
    });
};
exports.verifyJWT = verifyJWT;
var JWTAuthenticate = function (user) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var accessToken;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, generateJwt({ _id: user._id })];
            case 1:
                accessToken = _a.sent();
                console.log(accessToken);
                return [2 /*return*/, accessToken];
        }
    });
}); };
exports.JWTAuthenticate = JWTAuthenticate;
