"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const Token = {
    encrypt: function (data, time = '15d') {
        return jwt.sign(data, 'token', { expiresIn: time });
    },
    decrypt: function (token) {
        try {
            let data = jwt.verify(token, 'token');
            return {
                token: true,
                id: data.id
            };
        }
        catch (e) {
            return {
                token: false,
                data: e
            };
        }
    }
};
exports.default = Token;
