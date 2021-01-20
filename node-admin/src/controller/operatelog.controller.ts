import { Request,Response } from 'express'
import OperatelogModel  from '../models/operatelog.model'
import formateData from '../utils/formateData';


//type: 1 用户接口 2 角色接口 3 菜单接口 4 登录和其他主要接口 5其他

const getOperatelog = async (req:Request,resp:Response) => {
    OperatelogModel.getOperatelog(req,(data:any)=>{
        let returndata = formateData.replaceUnderLine(data.records);
        resp.send({
            code: 200,
            data: {
                records: returndata,
                total: data.total[0].total,
                page: data.page!=0 ? data.page: 1,
                pageSize: data.pageSize,
            }
        })
    })
}


export default {
    getOperatelog,
}
