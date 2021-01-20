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
const company_router_1 = __importDefault(require("./routes/company.router"));
const operatelog_router_1 = __importDefault(require("./routes/operatelog.router"));
const orlogin_1 = __importDefault(require("./middleware/orlogin"));
const setOpratelog_1 = __importDefault(require("./middleware/setOpratelog"));
const orUser_1 = __importDefault(require("./middleware/orUser"));
var ConnectCas = require('connect-cas2');
var session = require('express-session');
var MemoryStore = require('session-memory-store')(session);
class App {
    constructor(port) {
        this.port = port;
        this.app = express_1.default();
        this.middlewares();
        this.routes();
        this.setting();
        this.listen();
        this.connectCas();
    }
    routes() {
        this.app.use('/api', home_router_1.default);
        this.app.use('/api/role', role_router_1.default);
        this.app.use('/api/menu', menu_router_1.default);
        this.app.use('/api/users', user_router_1.default);
        this.app.use('/api/opreatelog', operatelog_router_1.default);
        this.app.use('/api/company', company_router_1.default);
    }
    middlewares() {
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(body_parser_1.default.json({ limit: '1mb' }));
        this.app.use(body_parser_1.default.urlencoded({
            extended: true
        }));
        this.app.use('/api', orlogin_1.default);
        this.app.use(setOpratelog_1.default);
    }
    listen() {
        this.app.listen(this.app.get('port'), () => {
            console.info('server running: localhost:' + this.app.get('port'));
        });
    }
    setting() {
        this.app.set('port', this.port || process.env.PORT || 3000);
    }
    connectCas() {
        var casClient = new ConnectCas({
            ignore: [
                /\/ignore/
            ],
            match: [],
            servicePrefix: 'http://cas.jia.com:3000',
            serverPath: 'https://cas.qeeka.com',
            paths: {
                validate: '/cas/validate',
                serviceValidate: '/cas/serviceValidate',
                proxy: '/cas/proxy',
                login: '/cas/login',
                logout: '/cas/logout',
                proxyCallback: '',
                restletIntegration: '/casLogin'
            },
            redirect: false,
            gateway: false,
            renew: false,
            slo: true,
            cache: {
                enable: false,
                ttl: 5 * 60 * 1000,
                filter: []
            },
            fromAjax: {
                header: 'x-client-ajax',
                status: 418
            },
            hooks: {
                after: (req, res, next) => {
                    next();
                }
            },
            restletIntegration: {
                demo1: {
                    trigger: function (req, res) {
                        console.log(res, "restletIntegration_req");
                        // Decision whether to use restlet integration, when matched, return true.
                        // Then CAS will not force the user to login, but can get a PT and interacted with the specific back-end service that support restlet integration by a special PGT. 
                        // return false
                    },
                    // Parameters that will send to CAS server to get a special PGT
                    params: {
                        username: 'restlet username',
                        from: 'http://localhost:3000/cas/validate',
                        password: 'restlet password'
                    }
                }
            }
        });
        this.app.use(session({
            name: 'NSESSIONID',
            secret: 'Hello I am a long long long secret',
            resave: true,
            saveUninitialized: true,
            store: new MemoryStore() // or other session store
        }));
        this.app.use(casClient.core());
        this.app.use(orUser_1.default);
        // or do some logic yourself
        this.app.get('/logout', function (req, res, next) {
            // Do whatever you like here, then call the logout middleware
            casClient.logout()(req, res, next);
        });
    }
}
exports.default = App;
