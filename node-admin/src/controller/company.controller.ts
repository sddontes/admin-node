import { Request,Response } from 'express'
import CompanyModel  from '../models/company.model'
import formateData from '../utils/formateData';

const getCompany = async (req:Request,resp:Response) => {
  CompanyModel.getCompany((data:any)=>{
    resp.send({
        code: 200,
        data: formateData.replaceUnderLine(data)
    })
})
}

const setCompany = async (req:Request,resp:Response) => {
    
}
const deleteCompany = async (req:Request,resp:Response) => {
    
}
const updateCompany = async (req:Request,resp:Response) => {
    
}

export default {
    getCompany,
    setCompany,
    deleteCompany,
    updateCompany
}
