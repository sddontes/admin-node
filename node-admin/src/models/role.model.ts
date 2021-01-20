import query from '../database'

const RoleModel = {
  async getRole(req:any,callback?:Function){
      const data = await query('select * from sys_role');
      const lastdata: any = data[0];
      const id= req.body.roleId
      var resObj={}
      lastdata.forEach((e:any)=>{
        id===e.id&&(resObj=e)
      })
      function filterRole(currentObj:any){
        const arr=lastdata.filter((e:any)=>currentObj.id===e.parent_id)
        currentObj.children= arr||[]
        if(arr.length){
          arr.forEach((ele:any)=>{
            filterRole(ele)
          })
        }
      }
      filterRole(resObj)
      console.log("resObj____",resObj)
      callback && callback(resObj)
  },
  async validityName(name:string) {
      const data = await query('select * from sys_role where name=?',[name]);
      return data[0];
  },
  async setRole(req:any,callback?:Function) {
      const data = await query('INSERT INTO `sys_role` (`type`,`name`, `remark`,`status`,`parent_id`) VALUES (1,?, ?, ?,?)',[req.body.name,req.body.remark,req.body.status,req.body.parentId])
      const lastdata: any = data[0];
      callback && callback(lastdata)
  },
  async deleteRole(req:any,callback?:Function){
    console.log(req.body.roleId,"+++++++++++++++req.body.roleId++++++++++++++++++++",req.body)
    const resData= await query('DELETE FROM sys_role WHERE id=?',[req.body.roleId])
    const lastdata: any = resData[0];
    callback && callback(lastdata)
  },
  async updateRole(req:any,callback?:Function){
    const resData= await query(`UPDATE sys_role SET name='${req.body.name}',remark='${req.body.remark}',status='${req.body.status}',parent_id='${req.body.parentId}' WHERE id=${req.body.id}`)
    console.log("updateRole,resData:",resData)
    const lastdata: any = resData[0];
    callback && callback(lastdata)
  },
  async getRoutes(req:any,callback?:Function){
    const resData= await query("select * from sys_role where roleId="+req.body.roleId)
    const lastdata: any = resData;
    callback && callback(lastdata)
  },
  async setRoutes(req:any,callback?:Function){
    let deleteQuery="DELETE FROM sys_role_acl_module WHERE role_id="+req.body.roleId;
    let addQuery = "INSERT INTO sys_role_acl_module (role_id,role_name,acl_id,acl_name) VALUES"
    console.log("req.body.rolePermissions_______________",req.body.rolePermissions)
    req.body.rolePermissions.forEach((e:any)=>{
      addQuery+=` ('${req.body.roleId}','${req.body.roleName}',${e},${e}),`
    })
    addQuery = addQuery.substring(0,addQuery.length - 1);
    console.log("addQuery",addQuery)
    
    await query(deleteQuery)
    const resData= await query(addQuery)
    const lastdata: any = resData[0];
    callback && callback(lastdata)
  }
}

export default  RoleModel;