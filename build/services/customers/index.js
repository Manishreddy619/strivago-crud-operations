"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var schema_1 = (0, tslib_1.__importDefault)(require("./schema"));
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var http_errors_1 = (0, tslib_1.__importDefault)(require("http-errors"));
var tools_1 = require("../auth/tools");
var tokenmiddleware_1 = require("../auth/tokenmiddleware");
var schema_2 = (0, tslib_1.__importDefault)(require("../accommodation/schema"));
var passport_1 = (0, tslib_1.__importDefault)(require("passport"));
var customerRouter = express_1.default.Router();
customerRouter.get("/googleLogin", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
customerRouter.get("/googleRedirect", passport_1.default.authenticate("google"), function (req, res, next) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    return (0, tslib_1.__generator)(this, function (_a) {
        try {
            console.log(req.user); // we are going to receive the tokens here thanks to the passportNext function and the serializeUser function
            res.redirect("http://localhost:3000?accessToken=" + req.user.tokens);
        }
        catch (error) {
            next(error);
        }
        return [2 /*return*/];
    });
}); }); // This endpoint receives the response from Google
customerRouter.post("/register", function (req, res, next) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var _a, email, password, role, user, newUser, customer, error_1;
    return (0, tslib_1.__generator)(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, role = _a.role;
                user = {
                    email: email,
                    password: password,
                    role: role,
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                newUser = new schema_1.default(user);
                return [4 /*yield*/, newUser.save()];
            case 2:
                customer = _b.sent();
                res.send(customer);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
customerRouter.post("/login", function (req, res, next) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var _a, email, password, user, accessToken, error_2;
    return (0, tslib_1.__generator)(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, schema_1.default.checkCredentials(email, password)];
            case 1:
                user = _b.sent();
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, tools_1.JWTAuthenticate)(user)];
            case 2:
                accessToken = _b.sent();
                res.send({ accessToken: accessToken });
                return [3 /*break*/, 4];
            case 3:
                next((0, http_errors_1.default)(401, "credentials are not ok"));
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
customerRouter.get("/me/accomadation", tokenmiddleware_1.JWTAuthMiddleware, function (req, res, next) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var id, accomadationMe, error_3;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.user);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                if (!req.user) return [3 /*break*/, 5];
                if (!(req.user.role === "Host")) return [3 /*break*/, 3];
                console.log("---------------", String(req.user._id));
                id = String(req.user._id);
                return [4 /*yield*/, schema_2.default.find({ userId: id })];
            case 2:
                accomadationMe = _a.sent();
                res.send(accomadationMe);
                return [3 /*break*/, 4];
            case 3:
                res.send((0, http_errors_1.default)(403, "you are forbidden for this activity"));
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                res.send((0, http_errors_1.default)(500, "server error"));
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
customerRouter.get("/me", tokenmiddleware_1.JWTAuthMiddleware, function (req, res, next) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    return (0, tslib_1.__generator)(this, function (_a) {
        try {
            if (req.user) {
                res.send({ staus: "ok", user: req.user });
            }
        }
        catch (error) {
            next(error);
        }
        return [2 /*return*/];
    });
}); });
exports.default = customerRouter;
