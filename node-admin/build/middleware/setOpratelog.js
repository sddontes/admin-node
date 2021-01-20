"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
function setOpratelog(req, res, next) {
    database_1.default('INSERT INTO sys_log (`value`,`path`,`operator`,`operate_ip`) VALUES (?,?,?,?)', [JSON.stringify(req.body), req.originalUrl, req.body.username || "", req.headers.host]);
    next();
}
exports.default = setOpratelog;
