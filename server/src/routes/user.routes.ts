import { createUser, deleteUser, getUser, updateUser } from '../controllers/user.controllers';
import { Router } from 'express';

const userRouter = Router();

// Create a new user
userRouter.post('/create', createUser);

// Get all users or a specific user by ID
userRouter.get('/get', getUser);
userRouter.get('/get/:id', getUser);

// Update a user
userRouter.put('/update', updateUser);

// Delete a user by ID
userRouter.delete('/delete/:id', deleteUser);

export default userRouter;
