"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const router = express_1.Router();
router.post('/getUsers', user_controller_1.default.getUsers);
router.post('/setUser', user_controller_1.default.setUser);
router.post('/deleteUser', user_controller_1.default.deleteUser);
router.post('/updateUser', user_controller_1.default.updateUser);
exports.default = router;
