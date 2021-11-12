"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var passport_1 = (0, tslib_1.__importDefault)(require("passport"));
var passport_google_oauth20_1 = (0, tslib_1.__importDefault)(require("passport-google-oauth20"));
var schema_1 = (0, tslib_1.__importDefault)(require("../customers/schema"));
var tools_1 = require("./tools");
var googleStrategy = new passport_google_oauth20_1.default({
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: "http://localhost:3001/customers/googleRedirect",
}, function (accessToken, refreshToken, googleProfile, passportNext) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var user, tokens, newUser, createdUser, savedUser, tokens, error_1;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(process.env.GOOGLE_OAUTH_ID);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                console.log("google profile", googleProfile);
                return [4 /*yield*/, schema_1.default.findOne({ googleId: googleProfile.id })];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, tools_1.JWTAuthenticate)(user)];
            case 3:
                tokens = _a.sent();
                passportNext(null, { tokens: tokens });
                return [3 /*break*/, 7];
            case 4:
                newUser = {
                    email: googleProfile.emails[0].value,
                    googleId: googleProfile.id,
                };
                createdUser = new schema_1.default(newUser);
                return [4 /*yield*/, createdUser.save()];
            case 5:
                savedUser = _a.sent();
                return [4 /*yield*/, (0, tools_1.JWTAuthenticate)(savedUser)];
            case 6:
                tokens = _a.sent();
                passportNext(null, { tokens: tokens });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                passportNext(error_1);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
passport_1.default.serializeUser(function (data, passportNext) {
    passportNext(null, data);
});
exports.default = googleStrategy;
