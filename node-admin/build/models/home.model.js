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
const HomeModel = {
    getMenu(useId, roleId, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (useId || roleId) {
                let sql = 'select * from sys_acl_module where id in (select acl_id  from sys_role_acl_module where role_id in (select role_id from sys_user_role where user_id=?)) ORDER BY seq';
                let id = useId;
                if (roleId) {
                    sql = 'select * from sys_acl_module where id in (select acl_id  from sys_role_acl_module where role_id = ?) ORDER BY seq';
                    id = roleId;
                }
                const data = yield database_1.default(sql, [id]);
                const lastdata = data[0];
                callback && callback(lastdata);
            }
        });
    },
    getUserLogin(account, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("account", account);
            const data = yield database_1.default('select * from sys_user where username=?', [account]);
            const lastdata = data[0];
            callback && callback(lastdata);
        });
    },
    getUserInfor(userId, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("${req.body.useId}", userId);
            const data = yield database_1.default(`SELECT a.user_id, role_id, role_name, c.department,c.company,a.username, a.remark,a.operate_time, a.mail, a.telephone, a.status FROM (select * from sys_user where user_id='${userId}') as a LEFT JOIN sys_user_role as b ON a.user_id = b.user_id LEFT JOIN sys_dept as c ON a.dept_id = c.id`);
            callback && callback(data[0]);
        });
    },
    getCompany(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default(`select * from sys_dept`);
            callback && callback(data[0]);
        });
    }
};
exports.default = HomeModel;
