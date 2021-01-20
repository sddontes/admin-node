"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const operatelog_controller_1 = __importDefault(require("../controller/operatelog.controller"));
const router = express_1.Router();
router.post('/getOperatelog', operatelog_controller_1.default.getOperatelog);
exports.default = router;
