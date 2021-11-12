"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericErrorHandler = exports.badRequestHandler = exports.notFoundHandler = exports.unauthorizedHandler = void 0;
var unauthorizedHandler = function (err, req, res, next) {
    if (err.status === 401) {
        res.status(401).send({
            status: 'error',
            message: err.message || 'You are not logged in!',
        });
    }
    else {
        next(err);
    }
};
exports.unauthorizedHandler = unauthorizedHandler;
var notFoundHandler = function (err, req, res, next) {
    if (err.status === 404) {
        res.status(err.status).send({ message: err.message || 'Not found!' });
    }
    else {
        next(err);
    }
};
exports.notFoundHandler = notFoundHandler;
var badRequestHandler = function (err, req, res, next) {
    if (err.status === 400 || err.name === 'ValidationError') {
        res.status(400).send({ message: err.errors || 'Bad Request!' });
    }
    else {
        next(err);
    }
};
exports.badRequestHandler = badRequestHandler;
var genericErrorHandler = function (err, req, res, next) {
    console.log(err);
    res.status(500).send({ message: 'Generic Server Error!' });
};
exports.genericErrorHandler = genericErrorHandler;
