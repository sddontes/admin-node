import query from '../database'

const HomeModel = {
    async getMenu(roleId?:string,callback?:Function){
        const data = await query( `select * from sys_acl_module where id in (select acl_id  from sys_role_acl_module where role_id in (${roleId})) ORDER BY seq`)
        const lastdata:any = data[0];
        callback && callback(lastdata);
    },
    async getUserLogin(account:string,callback?:Function) {
        const data = await query('select * from sys_user where username=?',[account]);
        const lastdata:any = data[0];
        callback && callback(lastdata);
    },
    async getUserInfor(userId:string,callback?:Function){
      const data = await query(`SELECT a.user_id, GROUP_CONCAT(b.role_id) role_id,GROUP_CONCAT(b.role_name) role_name, c.department,c.company,a.username, a.remark,a.operate_time, a.mail, a.telephone, a.status FROM (select * from sys_user where user_id='${userId}') as a LEFT JOIN sys_user_role as b ON a.user_id = b.user_id LEFT JOIN sys_dept as c ON a.dept_id = c.id GROUP BY a.user_id`);
      callback && callback(data[0]);
    },
    async getCompany(callback?:Function){
      const data = await query(`select * from sys_dept`);
      callback && callback(data[0]);
    }
}

export default  HomeModel;