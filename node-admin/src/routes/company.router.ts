import { Router } from 'express';
import CompanyController from '../controller/company.controller';

const router:Router = Router();

router.post('/getCompany',CompanyController.getCompany);
router.post('/setCompany',CompanyController.setCompany);
router.post('/deleteCompany',CompanyController.deleteCompany);
router.post('/updateCompany',CompanyController.updateCompany);

export default router;