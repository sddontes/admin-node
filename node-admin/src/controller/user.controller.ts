import { Request,Response } from 'express'
import UserModel  from '../models/user.model'
import formateData from '../utils/formateData';

const getUsers = async (req:Request,resp:Response) => {
  if(req.body.username!=='admin'){
    resp.send({
      code: 401,
      data: {
          msg: '没有查询用户的权限'
      }
    })
    return false;
  }
  UserModel.getUsers(req,(data:any)=>{
      resp.send({
          code: 200,
          data: {
              records: formateData.replaceUnderLine(data.records),
              pages:data.pages,
              currentPage:data.currentPage,
              count:data.count
          }
      })
  })
}
const setUser = async (req:Request,resp:Response) => {
  const { userName } = req.body;
  const data = await UserModel.validityName(userName);
  if(data.toString().length > 0){
      resp.send({
          code: 401,
          data: {
              msg: '用户已存在!!!'
          }
      })
      return false;
  }
  UserModel.setUser(req,(data: any)=>{
      if(data.affectedRows){
          resp.send({
              code: 200,
              data: {
                  msg: '操作成功'
              }
          })
      }else{
          resp.send({
              code: 401,
              data: {
                  msg: '操作失败'
              }
          })
      }
  })
}
const deleteUser = async (req:Request,resp:Response) => {
    UserModel.deleteUser(req.body.userId,(data:any)=>{
        if(data.affectedRows){
            resp.send({
                code: 200,
                data: {
                    msg: '操作成功'
                }
            })
        }else{
            resp.send({
                code: 401,
                data: {
                    msg: '操作失败'
                }
            })
        }
    })
}
const updateUser = async (req:Request,resp:Response) => {
    if(!req.body.useId){
        resp.send({
            code: 401,
            data: {
                msg: '参数错误'
            }
        })
        return;
    }
    UserModel.updateUser(req,(data:any)=>{
        if(data.affectedRows){
            resp.send({
                code: 200,
                data: {
                    msg: '操作成功'
                }
            })
        }else{
            resp.send({
                code: 401,
                data: {
                    msg: '操作失败'
                }
            })
        }
    })
}
const resetPassword = async (req:Request,resp:Response) => {
  console.log("req.body.userId",req.body)
  if(!req.body.useId){
    resp.send({
        code: 401,
        data: {
            msg: '参数错误'
        }
    })
    return;
  }
  UserModel.resetPassword(req,(data:any)=>{
      if(data.affectedRows){
          resp.send({
              code: 200,
              data: {
                  msg: '操作成功'
              }
          })
      }else{
          resp.send({
              code: 500,
              data: {
                  msg: '操作失败'
              }
          })
      }
  })
}
export default {
    getUsers,
    setUser,
    deleteUser,
    updateUser,
    resetPassword
}
