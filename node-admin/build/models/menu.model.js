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
const MenuModel = {
    getMenu(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default('select * from sys_acl_module');
            callback && callback(data[0]);
        });
    },
    validityName(parent_id, name, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default('select * from sys_acl_module where parent_id=? and name=? OR path=?', [parent_id, name, path]);
            return data[0];
        });
    },
    setMenu(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default('INSERT INTO `sys_acl_module` (`name`, `remark`,`status`,`seq`,`auth`,`icon`,`parent_id`,`url`,`level`,`type`,`path`) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?,?)', [req.body.name, req.body.remark || '', req.body.status, req.body.seq, req.body.auth || "", req.body.icon || "", req.body.parentId || 0, req.body.url || "", req.body.level || "", req.body.type, req.body.path || ""]);
            callback && callback(data[0]);
        });
    },
    deleteMenu(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default('DELETE FROM `sys_acl_module` WHERE id = ?', [req.body.id]);
            callback && callback(data[0]);
        });
    },
    updateMenu(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const mastData = {
                name: '',
                url: '',
                seq: 0,
                status: 0,
                remark: '',
                type: 1,
                auth: '',
                icon: '',
                path: ''
            };
            let lastData = {};
            let lastArr = [];
            let reqData = req.body;
            for (let key in reqData) {
                if (mastData.hasOwnProperty(key) && key != "id") {
                    lastData[key] = reqData[key];
                    lastArr.push(key);
                }
            }
            console.log(`UPDATE sys_acl_module SET ${lastArr.map((item, index) => {
                return `${item}=?`;
            })} WHERE id=?`);
            const data = yield database_1.default(`UPDATE sys_acl_module SET ${lastArr.map((item, index) => {
                return `${item}=?`;
            })} WHERE id=?`, [...lastArr.map((item, index) => {
                    return lastData[item];
                }), req.body.id]);
            callback && callback(data[0]);
        });
    }
};
exports.default = MenuModel;
