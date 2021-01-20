import query from '../database'

const HomeModel = {
    async getMenu(useId:string,roleId?:string,callback?:Function){
        if(useId || roleId){
            let sql = 'select * from sys_acl_module where id in (select acl_id  from sys_role_acl_module where role_id in (select role_id from sys_user_role where user_id=?))';
            let id = useId
            if(roleId){
              sql = 'select * from sys_acl_module where id in (select acl_id  from sys_role_acl_module where role_id = ?)'
              id = roleId
            }
            const data = await query(sql,[id])
            const lastdata:any = data[0];
            callback && callback(lastdata);
        }
    },
    async getUserLogin(account:string,callback?:Function) {
      console.log("account",account)
        const data = await query('select * from sys_user where username=?',[account]);
        const lastdata:any = data[0];
        callback && callback(lastdata);
    },
    async getUserInfor(userId:string,callback?:Function){
      console.log("${req.body.useId}",userId)
      const data = await query(`SELECT a.user_id, role_id, role_name, c.name,a.username, a.remark,a.operate_time, a.mail, a.telephone, a.status FROM (select * from sys_user where user_id='${userId}') as a LEFT JOIN sys_user_role as b ON a.user_id = b.user_id LEFT JOIN sys_dept as c ON a.dept_id = c.id`);
      callback && callback(data[0]);
  },
}

export default  HomeModel;