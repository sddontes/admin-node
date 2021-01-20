import query from '../database'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import formateData from '../utils/formateData';

const UserModel = {
    async getUsers(req:any,callback?:Function){
      const size=req.body.pageSize||10
      const pageFrom=(size*(req.body.currentPage-1))||0
      const counts:any[] = await query(`SELECT count('') count FROM sys_user WHERE status!=2`)
      const count=counts[0][0]["count"]
      const data:any[] = await query(`SELECT distinct a.user_id,GROUP_CONCAT(b.role_id) role_id,GROUP_CONCAT(b.role_name) role_name,c.id as deptId,c.department,c.company,a.username as userName, a.remark,a.operate_time, a.mail,a.telephone, a.status FROM sys_user as a LEFT JOIN sys_user_role as b ON a.user_id = b.user_id LEFT JOIN sys_dept as c ON a.dept_id = c.id WHERE a.status!=2 GROUP BY a.user_id order by a.operate_time LIMIT ?,?`,[pageFrom,size]);
      const resArr=data[0]
      callback && callback({records:resArr,pages:Math.ceil(count/size),currentPage:req.body.currentPage,count:count});
    },
    async getUserList(req:any,callback?:Function){
      // 过滤出改用户下的所有角色
      const roleData = await query('select * from sys_role');
      const roleArr: any = roleData[0];
      let ids:any[]= [{id:req.body.roleId}]
      const roles:any[]=[]
      function roleFilter(arr:any[]){
        arr.forEach((e:any)=>{
          let cArr=roleArr.filter((ele:any)=>ele.parent_id===e.id)
          ids=ids.concat(cArr)
          cArr.length&&roleFilter(cArr)
        })
      }
      roleFilter(ids)
      ids.shift()
      ids.forEach((e:any)=>{
        e.id&&roles.push(e.id)
      })
      const size=req.body.pageSize||10
      const pageFrom=(size*(req.body.currentPage-1))||0
      const counts:any[] = await query(`SELECT count('') count FROM sys_user as a LEFT JOIN sys_user_role as b ON a.user_id = b.user_id LEFT JOIN sys_dept as c ON a.dept_id = c.id WHERE a.status!=2 and b.role_id in (${roles.join()})`)
      const count=counts[0][0]["count"]
      const data:any[] = await query(`SELECT distinct a.user_id,GROUP_CONCAT(b.role_id) role_id,GROUP_CONCAT(b.role_name) role_name,c.id as deptId,c.department,c.company,a.username as userName, a.remark,a.operate_time, a.mail,a.telephone, a.status FROM sys_user as a LEFT JOIN sys_user_role as b ON a.user_id = b.user_id LEFT JOIN sys_dept as c ON a.dept_id = c.id WHERE a.status!=2 and b.role_id in (${roles.join()}) GROUP BY b.user_id LIMIT ?,?`,[pageFrom,size]);
      const resArr=data[0]
      callback && callback({records:resArr,pages:Math.ceil(count/size),currentPage:req.body.currentPage,count:count});
    },
    async deleteUser(userId:string,callback?:Function){
      // 逻辑删除用户，status字段0使用中1禁用2弃用
      const data = await query(`UPDATE sys_user SET status=2 WHERE user_id=?`,[userId]);
      callback && callback(data[0]);
    },
    async resetPassword(req:any,callback?:Function) {
      const md5 = crypto.createHash('md5')
      var mdpassword = md5.update('zhubei' + req.body.password).digest('hex')
      const data = await query(`UPDATE sys_user SET password=? WHERE user_id=?`,[mdpassword,req.body.userId]);
      callback && callback(data[0]);
  },
    async validityName(userName:string) {
        const data = await query('select * from sys_user where username=?',[userName]);
        return data[0];
    },
    async setUser(req:any,callback?:Function){
        const user_id =  uuidv4();
        const { userName,telephone,password,deptId,status,remark,roles,operator,operateTime } = req.body;
        try {
            const md5 = crypto.createHash('md5')
            var mdpassword = md5.update('zhubei' + password).digest('hex')
            const orRole:any = await this.addUserRole(user_id,roles);
            if(orRole.affectedRows){
                const data = await query('INSERT INTO `sys_user` (`user_id`,`username`, `remark`,`status`,`telephone`,`password`,`dept_id`,`operator`,`operate_time`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)',[user_id,userName,remark,parseInt(status),telephone,mdpassword,parseInt(deptId),operator,operateTime])
                callback && callback(data[0])
            }
        } catch (error) {
            console.log(error)
        }
    },
    async updateUser(req:any,callback?:Function){
        const mastData1 = {
            userName: "",
            telephone: "",
            mail: "",
            dept_id: 0,
            status: 0,
            remark: "",
            operateTime: "",
            operator:''   
        }
        const mastData2 = {
            role_name: "",
            role_id: 0
        }
        let lastData:any = {};
        let lastData2:any = {};
        let lastArr = [];
        let lastArr2 = [];
        let reqData = req.body;
        for(let key in reqData){
            let nextKey = formateData.toLine(key)
            if(mastData1.hasOwnProperty(nextKey) && nextKey!="user_id"){
                lastData[nextKey] = reqData[key]
                lastArr.push(nextKey);
            }
            if(mastData2.hasOwnProperty(nextKey) && nextKey!="user_id"){
                lastData2[nextKey] = reqData[key]
                lastArr2.push(nextKey);
            }
        }
        // const orupdate:any = await this.updateUserRole(req.body.userId,req.body.roles);
        if(req.body.roles&&req.body.roles.length){
          await this.deleteUserRole(req.body.userId)
          await this.addUserRole(req.body.userId,req.body.roles)
        }
        const data = await query(`UPDATE sys_user SET ${lastArr.map((item,index)=>{
            return`${item}=?`
        })} WHERE user_id=?`,[...lastArr.map((item,index)=>{
            return lastData[item]
        }),req.body.userId])
        callback && callback(data[0]);
    },
    async setUserRole(roles:any){
        const roleArr=roles
        const data = await query('INSERT INTO `sys_user_role` (`user_id`,`role_name`,`role_id`) VALUES '+roleArr);
        return data[0];
    },
    async addUserRole(user_id:string,roles:any){
      const roleArr=roles.map((ele:any)=>{
        return `('${user_id}','${ele.name}','${ele.id}') `
      })
      const sql='INSERT INTO `sys_user_role` (`user_id`,`role_name`,`role_id`) VALUES '+roleArr.join(",")
      const data = await query(sql);
      return data[0];
  },
    async deleteUserRole(user_id:string){
        const data = await query('DELETE FROM `sys_user_role` WHERE user_id=?',[user_id]);
        return data[0];
    },
    async updateUserRole(user_id:string,roles:any){
        // await query('DELETE FROM `sys_user_role` WHERE user_id=?',[user_id]);
        const roleArr=roles.map((ele:any)=>{
          return `('${user_id}','${ele.name}','${ele.id}') `
        })
        const sql='INSERT INTO `sys_user_role` (`user_id`,`role_name`,`role_id`) VALUES '+roleArr.join(",")
        const data = await query(sql);
        return data[0];
    }
}

export default  UserModel;