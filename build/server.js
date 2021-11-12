"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var mongoose_1 = (0, tslib_1.__importDefault)(require("mongoose"));
var express_list_endpoints_1 = (0, tslib_1.__importDefault)(require("express-list-endpoints"));
var cors_1 = (0, tslib_1.__importDefault)(require("cors"));
var index_1 = (0, tslib_1.__importDefault)(require("./services/customers/index"));
var oauth_1 = (0, tslib_1.__importDefault)(require("./services/auth/oauth"));
var passport_1 = (0, tslib_1.__importDefault)(require("passport"));
var body_parser_1 = (0, tslib_1.__importDefault)(require("body-parser"));
var errorHandlers_1 = require("./services/errorHandlers");
var index_2 = (0, tslib_1.__importDefault)(require("./services/accommodation/index"));
var server = (0, express_1.default)();
var port = process.env.PORT || 3001;
// ************************* MIDDLEWARES ********************************
// passport.use('google', googlestrategy);
server.use((0, cors_1.default)());
server.use(express_1.default.json());
server.use(body_parser_1.default.urlencoded({ extended: false }));
server.use(passport_1.default.initialize());
passport_1.default.use("google", oauth_1.default);
// server.use(passport.initialize());
// ************************* ROUTES ************************************
server.use("/customers", index_1.default);
server.use("/accomadation", index_2.default);
// ************************** ERROR HANDLERS ***************************
server.use(errorHandlers_1.unauthorizedHandler);
server.use(errorHandlers_1.notFoundHandler);
server.use(errorHandlers_1.badRequestHandler);
server.use(errorHandlers_1.genericErrorHandler);
console.log(process.env.GOOGLE_OAUTH_ID);
var mongo_url = process.env.MONGO_CONNECTION;
mongoose_1.default.connect(mongo_url);
mongoose_1.default.connection.on("connected", function () {
    console.log("Successfully connected to Mongo!");
    server.listen(port, function () {
        console.table((0, express_list_endpoints_1.default)(server));
        console.log("Server running on port " + port);
    });
});
mongoose_1.default.connection.on("error", function (err) {
    console.log(err);
});
