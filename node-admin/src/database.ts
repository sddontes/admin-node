import { createPool } from 'mysql2/promise';

const pool = createPool({
    host: 'rm-uf6dn32j615pxh72i.mysql.rds.aliyuncs.com',
    user: 'zb_test',
    password: '123456@Mysql',
    database: 'zhubei_front',    
    port: 3306,                   
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const query = async (data:any,args?:any)=>{
   const connet = await pool;
   const next = await connet.query(data,args);
   return next;
}

export default query;