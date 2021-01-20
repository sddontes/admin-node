import { Router } from 'express';
import UserController from '../controller/user.controller';

const router:Router = Router();

router.post('/getUsers',UserController.getUsers);
router.post('/setUser',UserController.setUser);
router.post('/deleteUser',UserController.deleteUser);
router.post('/updateUser',UserController.updateUser);
router.post('/resetPassword',UserController.resetPassword);

export default router;