"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mongoose_1 = (0, tslib_1.__importDefault)(require("mongoose"));
var Schema = mongoose_1.default.Schema, model = mongoose_1.default.model;
var accomadationSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    totalGuest: { type: Number, required: true },
    userId: { type: String },
}, {
    timestamps: true,
});
exports.default = model("Accomdation", accomadationSchema);
