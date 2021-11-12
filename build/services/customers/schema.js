"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mongoose_1 = (0, tslib_1.__importDefault)(require("mongoose"));
var bcrypt_1 = (0, tslib_1.__importDefault)(require("bcrypt"));
var Schema = mongoose_1.default.Schema, model = mongoose_1.default.model;
var customerSchema = new Schema({
    email: { type: String, required: true },
    password: {
        type: String,
    },
    role: { type: String, default: "Guest", enum: ["Guest", "Host"] },
    refreshToken: { type: String },
    googleId: {
        type: String,
    },
}, {
    timestamps: true,
});
customerSchema.pre("save", function (next) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var newCustomer, password, _a;
        return (0, tslib_1.__generator)(this, function (_b) {
            switch (_b.label) {
                case 0:
                    newCustomer = this;
                    password = newCustomer.password;
                    if (!newCustomer.isModified("password")) return [3 /*break*/, 2];
                    _a = newCustomer;
                    return [4 /*yield*/, bcrypt_1.default.hash(password, 11)];
                case 1:
                    _a.password = _b.sent();
                    _b.label = 2;
                case 2:
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
customerSchema.methods.toJSON = function () {
    var customerDocument = this;
    var customerObject = customerDocument.toObject();
    delete customerObject.password;
    return customerObject;
};
customerSchema.statics.checkCredentials = function (email, plainPW) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var customer, isMatch;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ email: email })];
                case 1:
                    customer = _a.sent();
                    if (!customer) return [3 /*break*/, 3];
                    return [4 /*yield*/, bcrypt_1.default.compare(plainPW, customer.password)];
                case 2:
                    isMatch = _a.sent();
                    // 3. Return a meaningful response
                    if (isMatch)
                        return [2 /*return*/, customer];
                    else
                        return [2 /*return*/, null]; // if the pw is not ok I'm returning null
                    return [3 /*break*/, 4];
                case 3: return [2 /*return*/, null]; // if the email is not ok I'm returning null as well
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.default = model("Customer", customerSchema);
