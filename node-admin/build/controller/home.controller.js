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
const home_model_1 = __importDefault(require("../models/home.model"));
const formateData_1 = __importDefault(require("../utils/formateData"));
const crypto_1 = __importDefault(require("crypto"));
const token_1 = __importDefault(require("../utils/token"));
const getMenu = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    home_model_1.default.getMenu(req.body.useId, req.body.roleId, (data) => {
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
const getUserLogin = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getUserLogin");
    try {
        const md5 = crypto_1.default.createHash('md5');
        var password = md5.update('zhubei' + req.body.password).digest('hex');
        console.log("================", password);
    }
    catch (error) {
        console.log(error);
    }
    home_model_1.default.getUserLogin(req.body.account, (data) => {
        if (data.toString().length) {
            if (password !== data[0].password) {
                resp.send({ code: 401, data: {
                        msg: '密码错误'
                    } });
            }
            else {
                delete data[0].password;
                resp.send({ code: 200, data: Object.assign({}, { token: token_1.default.encrypt({ id: data[0].user_id, username: data[0].username }) }, data[0]) });
            }
        }
        else {
            resp.send({ code: 401, data: {
                    msg: '不存在该用户'
                } });
        }
    });
});
const getUserInfor = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    home_model_1.default.getUserInfor(req.body.useId, (data) => {
        resp.send({
            code: 200,
            data: formateData_1.default.replaceUnderLine(data)[0]
        });
    });
});
const getCompany = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    home_model_1.default.getCompany((data) => {
        resp.send({
            code: 200,
            data: formateData_1.default.replaceUnderLine(data)
        });
    });
});
exports.default = {
    getMenu,
    getUserLogin,
    getUserInfor,
    getCompany
};
