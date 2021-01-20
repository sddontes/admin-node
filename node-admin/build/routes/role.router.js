"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = __importDefault(require("../controller/role.controller"));
const router = express_1.Router();
router.post('/getRole', role_controller_1.default.getRole);
router.post('/setRole', role_controller_1.default.setRole);
exports.default = router;
