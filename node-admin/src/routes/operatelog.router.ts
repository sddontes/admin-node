import { Router } from 'express';
import OperatelogController from '../controller/operatelog.controller';

const router:Router = Router();
router.post('/getOperatelog',OperatelogController.getOperatelog);

export default router;