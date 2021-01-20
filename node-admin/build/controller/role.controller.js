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
const role_model_1 = __importDefault(require("../models/role.model"));
const formateData_1 = __importDefault(require("../utils/formateData"));
const getRole = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    role_model_1.default.getRole(req, (data) => {
        resp.send({ code: 200, data: formateData_1.default.replaceUnderLine(data.children), message: "操作成功" });
    });
});
const setRole = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, remark, status } = req.body;
    const data = yield role_model_1.default.validityName(name);
    if (data.toString().length > 0) {
        resp.send({
            code: 401,
            data: {
                msg: '角色已存在!!!'
            }
        });
        return false;
    }
    role_model_1.default.setRole(name, remark, status, (data) => {
        if (data.affectedRows) {
            resp.send({
                code: 200,
                data: {
                    msg: '操作成功'
                }
            });
        }
    });
});
const deleteRole = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    role_model_1.default.getRoutes((data) => {
        resp.send({
            code: 200,
            data: {
                list: formateData_1.default.replaceUnderLine(data)
            }
        });
    });
});
const updateRole = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    role_model_1.default.updateRole(req, (data) => {
        resp.send({
            code: 200,
            data: {
                list: formateData_1.default.replaceUnderLine(data)
            }
        });
    });
});
const getRoutes = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    role_model_1.default.getRoutes(req, (data) => {
        resp.send({
            code: 200,
            data: {
                list: formateData_1.default.replaceUnderLine(data)
            }
        });
    });
});
const setRoutes = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    role_model_1.default.setRoutes(req, (data) => {
        resp.send({
            code: 200,
            data: {
                list: formateData_1.default.replaceUnderLine(data)
            }
        });
    });
});
exports.default = {
    getRole,
    setRole,
    deleteRole,
    updateRole,
    setRoutes,
    getRoutes
};
