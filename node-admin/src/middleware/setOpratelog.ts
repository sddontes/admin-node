import { Request,Response,NextFunction } from 'express'
import query from '../database'


function setOpratelog(req:Request, res:Response, next:NextFunction): void{
    query('INSERT INTO sys_log (`value`,`path`,`operator`,`operate_ip`) VALUES (?,?,?,?)',[JSON.stringify(req.body),req.originalUrl,req.body.username || "",req.headers.host])
    next()
}

export default setOpratelog;