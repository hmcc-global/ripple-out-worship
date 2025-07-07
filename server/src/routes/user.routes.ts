import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  changePassword,
} from '../controllers/user.controllers';
import { Router } from 'express';

const ownershipRouter = Router();

ownershipRouter.post('/create', createUser);
ownershipRouter.get('/get', getUser);
ownershipRouter.put('/update', updateUser);
ownershipRouter.put('/delete', deleteUser);
ownershipRouter.put('/change-password', changePassword);

export default ownershipRouter;
