"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAuthMiddleware = void 0;
var tslib_1 = require("tslib");
var http_errors_1 = (0, tslib_1.__importDefault)(require("http-errors"));
var schema_1 = (0, tslib_1.__importDefault)(require("../customers/schema"));
var tools_1 = require("./tools");
var JWTAuthMiddleware = function (req, res, next) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var token, decodedToken, user, error_1;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!req.headers.authorization) return [3 /*break*/, 1];
                next((0, http_errors_1.default)(401, "Please provide credentials in Authorization header"));
                return [3 /*break*/, 5];
            case 1:
                _a.trys.push([1, 4, , 5]);
                token = req.headers.authorization.replace("Bearer ", "");
                return [4 /*yield*/, (0, tools_1.verifyJWT)(token)];
            case 2:
                decodedToken = _a.sent();
                console.log("DECODED TOKEN ", decodedToken);
                return [4 /*yield*/, schema_1.default.findById(decodedToken._id)];
            case 3:
                user = _a.sent();
                if (user) {
                    req.user = user;
                    next();
                }
                else {
                    next((0, http_errors_1.default)(404, "User not found!"));
                }
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                next((0, http_errors_1.default)(401, "Token not valid!"));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.JWTAuthMiddleware = JWTAuthMiddleware;
