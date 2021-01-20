import query from '../database'

const MenuModel = {
    async getMenu(callback?:Function){
        const data = await query('select * from sys_acl_module');
        callback && callback(data[0])
    },
    async validityName(parent_id: number,name:string) {
        const data = await query('select * from sys_acl_module where parent_id= ? and name=?',[parent_id,name]);
        return data[0];
    },
    async setMenu(req:any,callback?:Function){
        const data = await query('INSERT INTO `sys_acl_module` (`name`, `remark`,`status`,`seq`,`auth`,`icon`,`parent_id`,`url`,`level`,`type`,`path`) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?,?)',
        [req.body.name,req.body.remark||'',req.body.status,req.body.seq,req.body.auth || "",req.body.icon|| "",req.body.parent_id || 0,req.body.url||"",req.body.level || "",req.body.type, req.body.path || ""]);
        callback && callback(data[0])
    },
    async deleteMenu(req:any,callback?:Function){
        const data = await query('DELETE FROM `sys_acl_module` WHERE id = ?',[req.body.id]);
        callback && callback(data[0])
    },
    async updateMenu(req:any,callback?:Function){
        const mastData = {
            name: '',
            url: '',
            seq: 0,
            status: 0,
            remark: '',
            type: 1,
            auth: '',
            icon: '',
            path: ''
        }
        let lastData:any = {};
        let lastArr = [];
        let reqData = req.body;
        for(let key in reqData){
            if(mastData.hasOwnProperty(key) && key!="id"){
                lastData[key] = reqData[key]
                lastArr.push(key);
            }
        }
        const data = await query(`UPDATE sys_acl_module SET ${lastArr.map((item,index)=>{
            return `${item}=?`
        })} WHERE id=?`,[...lastArr.map((item,index)=>{
            return lastData[item]
        }),req.body.id])
        callback && callback(data[0]);
    }
}

export default  MenuModel;