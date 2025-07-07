import {
  createOwnership,
  getOwnership,
  updateOwnership,
  deleteOwnership,
} from '../controllers/ownership.controllers';
import { Router } from 'express';

const ownershipRouter = Router();

ownershipRouter.post('/create', createOwnership);
ownershipRouter.get('/get', getOwnership);
ownershipRouter.put('/update', updateOwnership);
ownershipRouter.put('/delete', deleteOwnership);

export default ownershipRouter;
