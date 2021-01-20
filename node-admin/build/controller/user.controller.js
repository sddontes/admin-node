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
const user_model_1 = __importDefault(require("../models/user.model"));
const formateData_1 = __importDefault(require("../utils/formateData"));
const getUsers = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    user_model_1.default.getUsers(req, (data) => {
        resp.send({
            code: 200,
            data: {
                records: formateData_1.default.replaceUnderLine(data.records),
                pages: data.pages,
                currentPage: data.currentPage,
                count: data.count
            }
        });
    });
});
const setUser = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    const data = yield user_model_1.default.validityName(username);
    if (data.toString().length > 0) {
        resp.send({
            code: 401,
            data: {
                msg: '用户已存在!!!'
            }
        });
        return false;
    }
    user_model_1.default.setUser(req, (data) => {
        if (data.affectedRows) {
            resp.send({
                code: 200,
                data: {
                    msg: '操作成功'
                }
            });
        }
        else {
            resp.send({
                code: 401,
                data: {
                    msg: '操作失败'
                }
            });
        }
    });
});
const deleteUser = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    user_model_1.default.deleteUser(req.body.userId, (data) => {
        if (data.affectedRows) {
            resp.send({
                code: 200,
                data: {
                    msg: '操作成功'
                }
            });
        }
        else {
            resp.send({
                code: 401,
                data: {
                    msg: '操作失败'
                }
            });
        }
    });
});
const updateUser = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.useId) {
        resp.send({
            code: 401,
            data: {
                msg: '参数错误'
            }
        });
        return;
    }
    user_model_1.default.updateUser(req, (data) => {
        if (data.affectedRows) {
            resp.send({
                code: 200,
                data: {
                    msg: '操作成功'
                }
            });
        }
        else {
            resp.send({
                code: 401,
                data: {
                    msg: '操作失败'
                }
            });
        }
    });
});
const resetPassword = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body.userId", req.body);
    if (!req.body.useId) {
        resp.send({
            code: 401,
            data: {
                msg: '参数错误'
            }
        });
        return;
    }
    user_model_1.default.resetPassword(req, (data) => {
        if (data.affectedRows) {
            resp.send({
                code: 200,
                data: {
                    msg: '操作成功'
                }
            });
        }
        else {
            resp.send({
                code: 500,
                data: {
                    msg: '操作失败'
                }
            });
        }
    });
});
exports.default = {
    getUsers,
    setUser,
    deleteUser,
    updateUser,
    resetPassword
};
