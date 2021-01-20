import { Request,Response } from 'express'
import HomeModel  from '../models/home.model'
import formateData from '../utils/formateData';
import crypto from 'crypto'
import Token from '../utils/token';

const getMenu = async (req:Request,resp:Response) =>{
    HomeModel.getMenu(req.body.useId,req.body.roleId,(data:any): void=>{
        let returndata = formateData.replaceUnderLine(data);
        returndata = formateData.toTree(returndata)
        resp.send({
            code: 200,
            data: {
                records: returndata
            }
        })
    });
}

const getUserLogin = async (req:Request,resp:Response) =>{
  console.log("getUserLogin")
    try {
        const md5 = crypto.createHash('md5')
        var password = md5.update('zhubei' + req.body.password).digest('hex')
        console.log("================",password)
    } catch (error) {
        console.log(error)
    }
    HomeModel.getUserLogin(req.body.account,(data:any)=>{
        if(data.toString().length){
          console.log("密码错误data",data)
            if(password!==data[0].password){
                resp.send({code: 401,data: {
                    msg:'密码错误'
                }});
            }else{
                delete data[0].password
                resp.send({code: 200,data:Object.assign({},{token: Token.encrypt({id:data[0].user_id})},data[0])})
            }
        }else{
            resp.send({code: 401,data: {
                msg: '不存在该用户'
            }});
        }
    });
}
const getUserInfor = async (req:Request,resp:Response) => {
  HomeModel.getUserInfor(req.body.useId,(data:any)=>{
      resp.send({
          code: 200,
          data: formateData.replaceUnderLine(data)[0]
      })
  })
}
export default {
    getMenu,
    getUserLogin,
    getUserInfor
}