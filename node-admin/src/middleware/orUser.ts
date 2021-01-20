import { Response,NextFunction } from 'express'
import query from '../database'
import { v4 as uuidv4 } from 'uuid'
import Token from '../utils/token';

async function validateUser(username:string){
    const data = await query('select * from sys_user where username=?',[username])
    return data[0];
}

async function orUser(req:any, res:Response, next:NextFunction){
    console.log('---------req.originUrl',req.url);
    const username = req.session.cas.user;
    const calldata:any = await validateUser(username);
    if(calldata.length==0){
        const user_id =  uuidv4();
        const data:any = await query('INSERT INTO `sys_user` (`user_id`,`username`,`status`) VALUES ( ?, ?, ?)',[user_id,username,1])
        if(data.affectedRows){
            req.headers.token = Token.encrypt({id:user_id,username:username})
            if(req.url=="/logout"){
                res.redirect(301, ''); //齐家登录
            }else{
                next()
            }
        }
    }else{
        req.headers.token = Token.encrypt({id:calldata[0].user_id,username:calldata[0].username})
        if(req.url=="/logout"){
            res.redirect(301, ''); //齐家登录
        }else{
            next()
        }
    }
}



export default orUser;