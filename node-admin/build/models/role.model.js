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
const RoleModel = {
    getRole(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default('select * from sys_role');
            const lastdata = data[0];
            const id = req.body.roleId;
            var resObj = {};
            lastdata.forEach((e) => {
                id === e.id && (resObj = e);
            });
            function filterRole(currentObj) {
                const arr = lastdata.filter((e) => currentObj.id === e.parent_id);
                currentObj.children = arr || [];
                if (arr.length) {
                    arr.forEach((ele) => {
                        filterRole(ele);
                    });
                }
            }
            filterRole(resObj);
            console.log("resObj____", resObj);
            callback && callback(resObj);
        });
    },
    validityName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default('select * from sys_role where name=?', [name]);
            return data[0];
        });
    },
    setRole(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default('INSERT INTO `sys_role` (`type`,`name`, `remark`,`status`,`parent_id`) VALUES (1,?, ?, ?,?)', [req.body.name, req.body.remark, req.body.status, req.body.parentId]);
            const lastdata = data[0];
            callback && callback(lastdata);
        });
    },
    deleteRole(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body.roleId, "+++++++++++++++req.body.roleId++++++++++++++++++++", req.body);
            const resData = yield database_1.default('DELETE FROM sys_role WHERE id=?', [req.body.roleId]);
            const lastdata = resData[0];
            callback && callback(lastdata);
        });
    },
    updateRole(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const resData = yield database_1.default(`UPDATE sys_role SET name='${req.body.name}',remark='${req.body.remark}',status='${req.body.status}',parent_id='${req.body.parentId}' WHERE id=${req.body.id}`);
            console.log("updateRole,resData:", resData);
            const lastdata = resData[0];
            callback && callback(lastdata);
        });
    },
    getRoutes(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const resData = yield database_1.default("select * from sys_role where roleId=" + req.body.roleId);
            const lastdata = resData;
            callback && callback(lastdata);
        });
    },
    setRoutes(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let deleteQuery = "DELETE FROM sys_role_acl_module WHERE role_id=" + req.body.roleId;
            let addQuery = "INSERT INTO sys_role_acl_module (role_id,role_name,acl_id,acl_name) VALUES";
            console.log("req.body.rolePermissions_______________", req.body.rolePermissions);
            req.body.rolePermissions.forEach((e) => {
                addQuery += ` ('${req.body.roleId}','${req.body.roleName}',${e},${e}),`;
            });
            addQuery = addQuery.substring(0, addQuery.length - 1);
            console.log("addQuery", addQuery);
            yield database_1.default(deleteQuery);
            const resData = yield database_1.default(addQuery);
            const lastdata = resData[0];
            callback && callback(lastdata);
        });
    }
};
exports.default = RoleModel;
