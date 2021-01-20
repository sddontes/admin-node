"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const uuid_1 = require("uuid");
const token_1 = __importDefault(require("../utils/token"));
function validateUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield database_1.default('select * from sys_user where username=?', [username]);
        return data[0];
    });
}
function orUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('---------req.originUrl', req.url);
        const username = req.session.cas.user;
        const calldata = yield validateUser(username);
        if (calldata.length == 0) {
            const user_id = uuid_1.v4();
            const data = yield database_1.default('INSERT INTO `sys_user` (`user_id`,`username`,`status`) VALUES ( ?, ?, ?)', [user_id, username, 1]);
            if (data.affectedRows) {
                req.headers.token = token_1.default.encrypt({ id: user_id, username: username });
                if (req.url == "/logout") {
                    res.redirect(301, ''); //齐家登录
                }
                else {
                    next();
                }
            }
        }
        else {
            req.headers.token = token_1.default.encrypt({ id: calldata[0].user_id, username: calldata[0].username });
            if (req.url == "/logout") {
                res.redirect(301, ''); //齐家登录
            }
            else {
                next();
            }
        }
    });
}
exports.default = orUser;
