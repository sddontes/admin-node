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
const company_model_1 = __importDefault(require("../models/company.model"));
const formateData_1 = __importDefault(require("../utils/formateData"));
const getCompany = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    company_model_1.default.getCompany((data) => {
        resp.send({
            code: 200,
            data: formateData_1.default.replaceUnderLine(data)
        });
    });
});
const setCompany = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
});
const deleteCompany = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
});
const updateCompany = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.default = {
    getCompany,
    setCompany,
    deleteCompany,
    updateCompany
};
