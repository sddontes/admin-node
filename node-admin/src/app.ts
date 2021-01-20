import express,{ Application } from 'express';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import HomeRouter from './routes/home.router'
import RoleRouter from './routes/role.router'
import MenuRouter from './routes/menu.router'
import UserRouter from './routes/user.router'
import orloginMiddleware from './middleware/orlogin'

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
    }
    routes(){
        this.app.use('/api',HomeRouter)
        this.app.use('/api/role',RoleRouter)
        this.app.use('/api/menu',MenuRouter)
        this.app.use('/api/users',UserRouter)
    }
    middlewares(): void{
        this.app.use(logger('dev'));
        this.app.use(cors());
        this.app.use(bodyParser.json({limit: '1mb'}));
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use('/api',orloginMiddleware);
    }
    listen(){
        this.app.listen(this.app.get('port'),()=>{
            console.info('server running: localhost:'+this.app.get('port'));
        })
    }
    setting(){
        this.app.set('port',this.port || process.env.PORT || 3000);
    }
}