"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_controller_1 = __importDefault(require("../controller/home.controller"));
const router = express_1.Router();
router.post('/menu', home_controller_1.default.getMenu);
router.post('/user/login', home_controller_1.default.getUserLogin);
router.post('/getUserInfor', home_controller_1.default.getUserInfor);
router.post('/users/getCompany', home_controller_1.default.getCompany);
exports.default = router;
