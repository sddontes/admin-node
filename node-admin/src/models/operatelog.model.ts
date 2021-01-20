import query from '../database'

const OperatelogModel = {
    async getOperatelog(req:any,callback?:Function){
        let { page,pageSize,operateTime,path } = req.body;
        console.log({ page,pageSize,operateTime,path })
        let sql = `select id,value,path,operator,DATE_FORMAT(operate_time,'%Y-%m-%d %H:%i:%s') as operate_time,operate_ip FROM sys_log`
        let countSql = `select count(*) as total from sys_log`;
        let term:any = [];
        if(page==undefined){
            page = 0;
        }
        if(pageSize==undefined){
            pageSize = 10;
        }
        term = [( page-1 ) * pageSize < 0 ? 0 : ( page-1 ) * pageSize,pageSize];
        if(operateTime!="" && path!=""){
            sql += ` WHERE operate_time like ? and path=?`
            countSql += ` WHERE operate_time like ? and path=?`
            term.unshift(`%${operateTime}%`,path)
        }
        if(operateTime=="" && path!=""){
            sql += ` WHERE path=?`
            countSql += ` WHERE path=?`
            term.unshift(path)
        }
        if(operateTime!="" && path==""){
            sql += ` WHERE operate_time like ?`
            countSql += ` WHERE operate_time like ?`
            term.unshift(`%${operateTime}%`)
        }
        sql += ` order by operate_time desc limit ?,?`;
        const total = await query(countSql,term);
        const data = await query(sql,term);

        const resultData = {
            records: data[0],
            total: total[0],
            page,
            pageSize
        }
        callback && callback(resultData)
    },
}

export default  OperatelogModel;