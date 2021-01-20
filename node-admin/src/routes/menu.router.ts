import { Router } from 'express';
import MenuController from '../controller/menu.controller';

const router:Router = Router();

router.post('/getMenu',MenuController.getMenu);
router.post('/setMenu',MenuController.setMenu);
router.post('/deleteMenu',MenuController.deleteMenu);
router.post('/updateMenu',MenuController.updateMenu);

export default router;