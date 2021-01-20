import { Request,Response } from 'express'
import MenuModel  from '../models/menu.model'
import formateData from '../utils/formateData';

const getMenu = async (req:Request,resp:Response) => {
    MenuModel.getMenu((data:any)=>{
        let returndata = formateData.replaceUnderLine(data);
        returndata = formateData.toTree(returndata)
        resp.send({
            code: 200,
            data: {
                records: returndata
            }
        })
    })
}

const setMenu = async (req:Request,resp:Response) => {
    const data = await MenuModel.validityName(req.body.parent_id,req.body.name,req.body.path);
    if(data.toString().length > 0){
        resp.send({
            code: 401,
            data: {
                msg: '菜单已存在!!!'
            }
        })
        return false;
    }
    MenuModel.setMenu(req,(data: any)=>{
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
const deleteMenu = async (req:Request,resp:Response) => {
    MenuModel.deleteMenu(req,(data:any)=>{
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
const updateMenu = async (req:Request,resp:Response) => {
    if(!req.body.id){
        resp.send({
            code: 401,
            data: {
                msg: '参数错误'
            }
        })
        return;
    }
    MenuModel.updateMenu(req,(data:any)=>{
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

export default {
    getMenu,
    setMenu,
    deleteMenu,
    updateMenu
}
