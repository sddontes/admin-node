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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var database_1 = require("../database");
var MenuModel = {
    getMenu: function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]('select * from sys_acl_module')];
                    case 1:
                        data = _a.sent();
                        callback && callback(data[0]);
                        return [2 /*return*/];
                }
            });
        });
    },
    validityName: function (parent_id, name) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]('select * from sys_acl_module where parent_id= ? and name=?', [parent_id, name])];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data[0]];
                }
            });
        });
    },
    setMenu: function (req, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]('INSERT INTO `sys_acl_module` (`name`, `remark`,`status`,`seq`,`auth`,`icon`,`parent_id`,`url`,`level`,`type`,`path`) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?,?)', [req.body.name, req.body.remark || '', req.body.status, req.body.seq, req.body.auth || "", req.body.icon || "", req.body.parent_id || 0, req.body.url || "", req.body.level || "", req.body.type, req.body.path || ""])];
                    case 1:
                        data = _a.sent();
                        callback && callback(data[0]);
                        return [2 /*return*/];
                }
            });
        });
    },
    deleteMenu: function (req, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"]('DELETE FROM `sys_acl_module` WHERE id = ?', [req.body.id])];
                    case 1:
                        data = _a.sent();
                        callback && callback(data[0]);
                        return [2 /*return*/];
                }
            });
        });
    },
    updateMenu: function (req, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var mastData, lastData, lastArr, reqData, key, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mastData = {
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
                        lastData = {};
                        lastArr = [];
                        reqData = req.body;
                        for (key in reqData) {
                            if (mastData.hasOwnProperty(key) && key != "id") {
                                lastData[key] = reqData[key];
                                lastArr.push(key);
                            }
                        }
                        return [4 /*yield*/, database_1["default"]("UPDATE sys_acl_module SET " + lastArr.map(function (item, index) {
                                return item + "=?";
                            }) + " WHERE id=?", __spreadArrays(lastArr.map(function (item, index) {
                                return lastData[item];
                            }), [req.body.id]))];
                    case 1:
                        data = _a.sent();
                        callback && callback(data[0]);
                        return [2 /*return*/];
                }
            });
        });
    }
};
exports["default"] = MenuModel;
