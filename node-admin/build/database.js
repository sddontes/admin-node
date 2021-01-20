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
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const pool = promise_1.createPool({
    host: 'rm-uf6dn32j615pxh72i.mysql.rds.aliyuncs.com',
    user: 'zb_test',
    password: '123456@Mysql',
    database: 'zhubei_front',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const query = (data, args) => __awaiter(void 0, void 0, void 0, function* () {
    const connet = yield pool;
    const next = yield connet.query(data, args);
    return next;
});
exports.default = query;
