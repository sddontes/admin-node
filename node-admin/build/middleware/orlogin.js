"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../utils/token"));
function orloginMiddleware(req, res, next) {
    const originUrl = req.originalUrl.split("?")[0];
    console.log("req.originalUrl____", [originUrl, '/api/user/login', '/api/cas/login'].includes(originUrl));
    if (['/api/user/login', '/cas/validate', '/cas/login'].includes(originUrl)) {
        next();
        return;
    }
    const token = req.headers.authorization || req.headers.token;
    if (!token) {
        res.send({
            code: 401,
            data: {
                msg: '您未登录'
            }
        });
    }
    else {
        let deToken = token_1.default.decrypt(token);
        if (deToken.token) {
            req.body.useId = deToken.id;
            req.body.username = deToken.username;
            next();
        }
        else {
            res.send({
                code: 401,
                data: {
                    msg: '登录失效，Token过期'
                }
            });
        }
    }
}
exports.default = orloginMiddleware;
