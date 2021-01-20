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
const OperatelogModel = {
    getOperatelog(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let { page, pageSize, operateTime, path } = req.body;
            console.log({ page, pageSize, operateTime, path });
            let sql = `select id,value,path,operator,DATE_FORMAT(operate_time,'%Y-%m-%d %H:%i:%s') as operate_time,operate_ip FROM sys_log`;
            let countSql = `select count(*) as total from sys_log`;
            let term = [];
            if (page == undefined) {
                page = 0;
            }
            if (pageSize == undefined) {
                pageSize = 10;
            }
            term = [(page - 1) * pageSize < 0 ? 0 : (page - 1) * pageSize, pageSize];
            if (operateTime != "" && path != "") {
                sql += ` WHERE operate_time like ? and path=?`;
                countSql += ` WHERE operate_time like ? and path=?`;
                term.unshift(`%${operateTime}%`, path);
            }
            if (operateTime == "" && path != "") {
                sql += ` WHERE path=?`;
                countSql += ` WHERE path=?`;
                term.unshift(path);
            }
            if (operateTime != "" && path == "") {
                sql += ` WHERE operate_time like ?`;
                countSql += ` WHERE operate_time like ?`;
                term.unshift(`%${operateTime}%`);
            }
            sql += ` order by operate_time desc limit ?,?`;
            const total = yield database_1.default(countSql, term);
            const data = yield database_1.default(sql, term);
            const resultData = {
                records: data[0],
                total: total[0],
                page,
                pageSize
            };
            callback && callback(resultData);
        });
    },
};
exports.default = OperatelogModel;
