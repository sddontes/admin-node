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
const crypto_1 = __importDefault(require("crypto"));
const formateData_1 = __importDefault(require("../utils/formateData"));
const UserModel = {
    getUsers(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default('SELECT a.user_id, role_id, role_name, c.`name`,a.username, a.remark,a.operate_time, a.mail, a.telephone, a.`status` FROM `sys_user` as a LEFT JOIN `sys_user_role` as b ON a.user_id = b.user_id LEFT JOIN `sys_dept` as c ON a.dept_id = c.id');
            callback && callback(data[0]);
        });
    },
    deleteUser(userId, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const ordelete = yield this.deleteUserRole(userId);
            if (ordelete.affectedRows) {
                const data = yield database_1.default('DELETE FROM `sys_user` WHERE user_id=?', [userId]);
                callback && callback(data[0]);
            }
        });
    },
    validityName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default('select * from sys_user where username=?', [username]);
            return data[0];
        });
    },
    setUser(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = uuid_1.v4();
            const { username, telephone, mail, password, deptId, status, remark, roleName, roleId } = req.body;
            try {
                const md5 = crypto_1.default.createHash('md5');
                var mdpassword = md5.update('zhubei' + password).digest('hex');
                const orRole = yield this.setUserRole(user_id, roleName, parseInt(roleId));
                if (orRole.affectedRows) {
                    const data = yield database_1.default('INSERT INTO `sys_user` (`user_id`,`username`, `remark`,`status`,`telephone`,`mail`,`password`,`dept_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [user_id, username, remark, parseInt(status), telephone, mail, mdpassword, parseInt(deptId)]);
                    callback && callback(data[0]);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    },
    updateUser(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const mastData1 = {
                username: "",
                telephone: "",
                mail: "",
                // password: "",
                dept_id: 0,
                status: 0,
                remark: "",
            };
            const mastData2 = {
                role_name: "",
                role_id: 0
            };
            let lastData = {};
            let lastData2 = {};
            let lastArr = [];
            let lastArr2 = [];
            let reqData = req.body;
            console.log(reqData);
            for (let key in reqData) {
                let nextKey = formateData_1.default.toLine(key);
                if (mastData1.hasOwnProperty(nextKey) && nextKey != "user_id") {
                    lastData[nextKey] = reqData[key];
                    lastArr.push(nextKey);
                }
                if (mastData2.hasOwnProperty(nextKey) && nextKey != "user_id") {
                    lastData2[nextKey] = reqData[key];
                    lastArr2.push(nextKey);
                }
            }
            const orupdate = yield this.updateUserRole(req.body.userId, lastData2, lastArr2);
            if (orupdate.affectedRows) {
                const data = yield database_1.default(`UPDATE sys_user SET ${lastArr.map((item, index) => {
                    return `${item}=?`;
                })} WHERE user_id=?`, [...lastArr.map((item, index) => {
                        return lastData[item];
                    }), req.body.userId]);
                callback && callback(data[0]);
            }
        });
    },
    setUserRole(user_id, roleName, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default('INSERT INTO `sys_user_role` (`user_id`,`role_name`,`role_id`) VALUES (?,?,?)', [user_id, roleName, roleId]);
            return data[0];
        });
    },
    deleteUserRole(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default('DELETE FROM `sys_user_role` WHERE user_id=?', [user_id]);
            return data[0];
        });
    },
    updateUserRole(user_id, lastData2, lastArr2) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default(`UPDATE sys_user_role SET ${lastArr2.map((item, index) => {
                return `${item}=?`;
            })} WHERE user_id=?`, [...lastArr2.map((item, index) => {
                    console.log(lastData2[item]);
                    return lastData2[item];
                }), user_id]);
            return data[0];
        });
    }
};
exports.default = UserModel;
