"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = __importDefault(require("../controller/company.controller"));
const router = express_1.Router();
router.post('/getCompany', company_controller_1.default.getCompany);
router.post('/setCompany', company_controller_1.default.setCompany);
router.post('/deleteCompany', company_controller_1.default.deleteCompany);
router.post('/updateCompany', company_controller_1.default.updateCompany);
exports.default = router;
