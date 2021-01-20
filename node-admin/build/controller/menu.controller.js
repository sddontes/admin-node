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
const menu_model_1 = __importDefault(require("../models/menu.model"));
const formateData_1 = __importDefault(require("../utils/formateData"));
const getMenu = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    menu_model_1.default.getMenu((data) => {
        let returndata = formateData_1.default.replaceUnderLine(data);
        returndata = formateData_1.default.toTree(returndata);
        resp.send({
            code: 200,
            data: {
                records: returndata
            }
        });
    });
});
const setMenu = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield menu_model_1.default.validityName(req.body.parent_id, req.body.name, req.body.path);
    if (data.toString().length > 0) {
        resp.send({
            code: 401,
            data: {
                msg: '菜单已存在!!!'
            }
        });
        return false;
    }
    menu_model_1.default.setMenu(req, (data) => {
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
const deleteMenu = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    menu_model_1.default.deleteMenu(req, (data) => {
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
const updateMenu = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.id) {
        resp.send({
            code: 401,
            data: {
                msg: '参数错误'
            }
        });
        return;
    }
    menu_model_1.default.updateMenu(req, (data) => {
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
exports.default = {
    getMenu,
    setMenu,
    deleteMenu,
    updateMenu
};
