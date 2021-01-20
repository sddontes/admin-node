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
const operatelog_model_1 = __importDefault(require("../models/operatelog.model"));
const formateData_1 = __importDefault(require("../utils/formateData"));
//type: 1 用户接口 2 角色接口 3 菜单接口 4 登录和其他主要接口 5其他
const getOperatelog = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    operatelog_model_1.default.getOperatelog(req, (data) => {
        let returndata = formateData_1.default.replaceUnderLine(data.records);
        resp.send({
            code: 200,
            data: {
                records: returndata,
                total: data.total[0].total,
                page: data.page != 0 ? data.page : 1,
                pageSize: data.pageSize,
            }
        });
    });
});
exports.default = {
    getOperatelog,
};
