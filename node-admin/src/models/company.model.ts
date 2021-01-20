import query from '../database'

const CompanyModel = {
  async getCompany(callback?:Function){
    const data = await query(`select * from sys_dept`);
    callback && callback(data[0]);
  }
}

export default  CompanyModel;