import { Router } from 'express';
import RoleController from '../controller/role.controller';

const router:Router = Router();

router.post('/getRole',RoleController.getRole);
router.post('/setRole',RoleController.setRole)
router.post('/updateRole',RoleController.updateRole)
router.post('/deleteRole',RoleController.deleteRole)
router.post('/getRoutes',RoleController.getRoutes)
router.post('/setRoutes',RoleController.setRoutes)

export default router;