"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const home_router_1 = __importDefault(require("./routes/home.router"));
const role_router_1 = __importDefault(require("./routes/role.router"));
const menu_router_1 = __importDefault(require("./routes/menu.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const orlogin_1 = __importDefault(require("./middleware/orlogin"));
class App {
    constructor(port) {
        this.port = port;
        this.app = express_1.default();
        this.middlewares();
        this.routes();
        this.setting();
        this.listen();
    }
    routes() {
        this.app.use('/api', home_router_1.default);
        this.app.use('/api/role', role_router_1.default);
        this.app.use('/api/menu', menu_router_1.default);
        this.app.use('/api/users', user_router_1.default);
    }
    middlewares() {
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(body_parser_1.default.json({ limit: '1mb' }));
        this.app.use(body_parser_1.default.urlencoded({
            extended: true
        }));
        this.app.use('/api', orlogin_1.default);
    }
    listen() {
        this.app.listen(this.app.get('port'), () => {
            console.info('server running: localhost:' + this.app.get('port'));
        });
    }
    setting() {
        console.log("port :", this.port || process.env.PORT || 3000);
        this.app.set('port', this.port || process.env.PORT || 3000);
    }
}
exports.default = App;
