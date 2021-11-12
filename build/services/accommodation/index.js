"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var http_errors_1 = (0, tslib_1.__importDefault)(require("http-errors"));
var tokenmiddleware_1 = require("../auth/tokenmiddleware");
var schema_1 = (0, tslib_1.__importDefault)(require("./schema"));
var accomRouter = express_1.default.Router();
accomRouter.post("/", tokenmiddleware_1.JWTAuthMiddleware, function (req, res, next) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var _a, name_1, description, city, totalGuest, acc, newAccomadation, accomadation, error_1;
    var _b;
    return (0, tslib_1.__generator)(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                if (!req.user) return [3 /*break*/, 4];
                if (!(((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "Guest")) return [3 /*break*/, 1];
                res.send((0, http_errors_1.default)(403, "you are forbidden for this activity"));
                return [3 /*break*/, 3];
            case 1:
                _a = req.body, name_1 = _a.name, description = _a.description, city = _a.city, totalGuest = _a.totalGuest;
                acc = {
                    name: name_1,
                    description: description,
                    city: city,
                    totalGuest: totalGuest,
                    userId: req.user._id,
                };
                newAccomadation = new schema_1.default(acc);
                return [4 /*yield*/, newAccomadation.save()];
            case 2:
                accomadation = _c.sent();
                res.send(accomadation);
                _c.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                res.send((0, http_errors_1.default)(500, "server error"));
                _c.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _c.sent();
                next(error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
accomRouter.get("/", tokenmiddleware_1.JWTAuthMiddleware, 
// JWTAuthMiddleware,
// adminOnlyMiddleware,
function (req, res, next) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var accomadations, error_2;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!req.user) return [3 /*break*/, 2];
                return [4 /*yield*/, schema_1.default.find()];
            case 1:
                accomadations = _a.sent();
                res.send(accomadations);
                return [3 /*break*/, 3];
            case 2:
                res.send("you must be logged in to access our source");
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
accomRouter.get("/:accId", tokenmiddleware_1.JWTAuthMiddleware, function (req, res, next) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var accId, accomadation, error_3;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                accId = req.params.accId;
                if (!req.user) return [3 /*break*/, 2];
                return [4 /*yield*/, schema_1.default.findById(accId)];
            case 1:
                accomadation = _a.sent();
                // similar to findOne, but findOne expects to receive a query as parameter
                if (accomadation) {
                    res.send(accomadation);
                }
                else {
                    console.log(accId);
                    next((0, http_errors_1.default)(404, "accomadation with id " + accId + " not found!"));
                }
                return [3 /*break*/, 3];
            case 2:
                res.send("you must be logged in to access our source");
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
accomRouter.put("/:accId", tokenmiddleware_1.JWTAuthMiddleware, function (req, res, next) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var accId, modifiedAccomadation, error_4;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!req.user) return [3 /*break*/, 4];
                if (!(req.user.role === "Host")) return [3 /*break*/, 2];
                accId = req.params.accId;
                return [4 /*yield*/, schema_1.default.findByIdAndUpdate(accId, req.body, {
                        new: true, // returns the modified blog
                    })];
            case 1:
                modifiedAccomadation = _a.sent();
                if (modifiedAccomadation) {
                    res.send(modifiedAccomadation);
                }
                else {
                    next((0, http_errors_1.default)(404, "blog with id " + accId + " not found!"));
                }
                return [3 /*break*/, 3];
            case 2:
                res.send((0, http_errors_1.default)(403, "you are forbidden for this activity"));
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                res.send((0, http_errors_1.default)(500, "server error"));
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
accomRouter.delete("/:accId", tokenmiddleware_1.JWTAuthMiddleware, function (req, res, next) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var accId, deletedAccomdation, error_5;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!req.user) return [3 /*break*/, 4];
                if (!(req.user.role === "Host")) return [3 /*break*/, 2];
                accId = req.params.accId;
                return [4 /*yield*/, schema_1.default.findByIdAndDelete(accId)];
            case 1:
                deletedAccomdation = _a.sent();
                if (deletedAccomdation) {
                    res.status(204).send();
                }
                else {
                    next((0, http_errors_1.default)(404, "blog with id " + accId + " not found!"));
                }
                return [3 /*break*/, 3];
            case 2:
                res.send((0, http_errors_1.default)(403, "you are forbidden for this activity"));
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                res.send((0, http_errors_1.default)(500, "server error"));
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.default = accomRouter;
