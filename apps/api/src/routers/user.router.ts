import { UserController } from '@/controllers/user.controller';
import { verifyToken } from '@/middlewares/token';
import { validateRegister } from '@/middlewares/validator';
import { Router } from 'express';
import { uploader } from '../middlewares/uploader';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/create',
      validateRegister,
      this.userController.createUser,
    );
    this.router.post('/login', this.userController.logInUser);
    this.router.get('/profile/:id', verifyToken, this.userController.getUserId);
    this.router.patch('/verify', verifyToken, this.userController.verifyUser);
    this.router.post('/deposit/:id', verifyToken, this.userController.deposit);
    this.router.patch(
      '/avatar',
      verifyToken,
      uploader('avatar', '/avatar').single('avatar'),
      this.userController.editAvatar,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
