"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menu_controller_1 = __importDefault(require("../controller/menu.controller"));
const router = express_1.Router();
router.post('/getMenu', menu_controller_1.default.getMenu);
router.post('/setMenu', menu_controller_1.default.setMenu);
router.post('/deleteMenu', menu_controller_1.default.deleteMenu);
router.post('/updateMenu', menu_controller_1.default.updateMenu);
exports.default = router;
