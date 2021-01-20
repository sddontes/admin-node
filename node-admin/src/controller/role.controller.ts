import { Request,Response } from 'express'
import RoleModel  from '../models/role.model'
import formateData from '../utils/formateData';

const getRole = async (req:Request,resp:Response) =>{
   RoleModel.getRole(req,(data:any)=>{
    resp.send({code: 200,data: formateData.replaceUnderLine([data]),message: "操作成功"})
   })
}

const setRole = async (req:Request,resp:Response) =>{
    const { name,remark,status } = req.body;
    const data = await RoleModel.validityName(name);
    if(data.toString().length > 0){
        resp.send({
            code: 401,
            data: {
                msg: '角色已存在!!!'
            }
        })
        return false;
    }
    RoleModel.setRole(req,(data: any)=>{
        if(data.affectedRows){
            resp.send({
                code: 200,
                data: {
                    msg: '操作成功'
                }
            })
        }
    })
}
const deleteRole = async (req:Request,resp:Response) =>{
  RoleModel.deleteRole(req,(data:any)=>{
    if(data.affectedRows){
      resp.send({
          code: 200,
          data: {
              msg: '操作成功'
          }
      })
    }
  })
}
const updateRole = async (req:Request,resp:Response) =>{
  RoleModel.updateRole(req,(data:any)=>{
    if(data.affectedRows){
      resp.send({
          code: 200,
          data: {
              msg: '操作成功'
          }
      })
    }
  })
}
const getRoutes = async (req:Request,resp:Response) =>{
  RoleModel.getRoutes(req,(data:any)=>{
   resp.send({
       code: 200,
       data: {
           list: formateData.replaceUnderLine(data)
       }
   })
  })
}
const setRoutes = async (req:Request,resp:Response) =>{
  RoleModel.setRoutes(req,(data:any)=>{
    if(data.affectedRows){
      resp.send({
          code: 200,
          data: {
              msg: '操作成功'
          }
      })
    }
  })
}

export default {
    getRole,
    setRole,
    deleteRole,
    updateRole,
    setRoutes,
    getRoutes
}