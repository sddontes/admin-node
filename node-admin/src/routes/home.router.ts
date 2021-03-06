import { Router } from 'express';
import HomeController from '../controller/home.controller';

const router:Router = Router();

router.post('/menu',HomeController.getMenu);
router.post('/user/login',HomeController.getUserLogin)
router.post('/getUserInfor',HomeController.getUserInfor);

export default router;