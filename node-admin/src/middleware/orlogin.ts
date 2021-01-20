import { Request,Response,NextFunction } from 'express'
import Token from '../utils/token';

function orloginMiddleware(req:Request, res:Response, next:NextFunction): void{
  console.log("req.originalUrl____",req.originalUrl)
    if(['/api/user/login'].includes(req.originalUrl)){
      next()
      return;
    }
     const token = req.headers.authorization||req.headers.token
     if(!token){
      res.send({
        code: 401,
        data: {
          msg: '您未登录'
        }
      })
     }else{
      let deToken = Token.decrypt(token);
      if(deToken.token){
       req.body.useId = deToken.id;
       next()
      }else{
       res.send({
         code: 401,
         data: {
           msg: '登录失效，Token过期'
         }
       })
      }
    }
}

export default orloginMiddleware;