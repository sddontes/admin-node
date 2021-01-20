"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../utils/token"));
function orloginMiddleware(req, res, next) {
    console.log("req.originalUrl____", req.originalUrl);
    if (['/api/user/login'].includes(req.originalUrl)) {
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
