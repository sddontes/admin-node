import express,{ Application } from 'express';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import HomeRouter from './routes/home.router'
import RoleRouter from './routes/role.router'
import MenuRouter from './routes/menu.router'
import UserRouter from './routes/user.router'
import CompanyRouter from './routes/company.router'
import OpreatelogRouter from './routes/operatelog.router'
import orloginMiddleware from './middleware/orlogin'
import setOpratelog from './middleware/setOpratelog'
import orUser from './middleware/orUser'

var ConnectCas = require('connect-cas2');
var session = require('express-session');
var MemoryStore = require('session-memory-store')(session);
export default class App{
    private app: Application;
    port?: number;
    constructor(port?:number){
        this.port = port;
        this.app = express();
        this.middlewares();
        this.routes();
        this.setting();
        this.listen();
        this.connectCas();
    }
    routes(){
        this.app.use('/api',HomeRouter)
        this.app.use('/api/role',RoleRouter)
        this.app.use('/api/menu',MenuRouter)
        this.app.use('/api/users',UserRouter)
        this.app.use('/api/opreatelog',OpreatelogRouter)
        this.app.use('/api/company',CompanyRouter)
    }
    middlewares(): void{
        this.app.use(logger('dev'));
        this.app.use(cors());
        this.app.use(bodyParser.json({limit: '1mb'}));
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use('/api',orloginMiddleware);
        this.app.use(setOpratelog);
    }
    listen(){
        this.app.listen(this.app.get('port'),()=>{
            console.info('server running: localhost:'+this.app.get('port'));
        })
    }
    setting(){
        this.app.set('port',this.port || process.env.PORT || 3000);
    }
    connectCas(){
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
            restletIntegration:'/casLogin'
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
            after:(req:any,res:any,next:Function)=>{
              next()
            }
          },
          restletIntegration: {
            demo1: {
              trigger: function(req:any,res:any) {
                console.log(res,"restletIntegration_req")
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
        resave:true,//添加这行
        saveUninitialized: true,//添加这行
        store: new MemoryStore()  // or other session store
      }));
      this.app.use(casClient.core());
      this.app.use(orUser);
      // or do some logic yourself
      this.app.get('/logout', function(req, res, next) {
        // Do whatever you like here, then call the logout middleware
        casClient.logout()(req, res, next);
      });
    }
}