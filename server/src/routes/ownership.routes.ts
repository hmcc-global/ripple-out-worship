import {
  createOwnership,
  getOwnership,
  updateOwnership,
  deleteOwnership,
} from '../controllers/ownership.controllers';
import { createPermissionRouter } from '../policies';

const router = createPermissionRouter('/ownerships');

router.post('/create', createOwnership);
router.get('/get', getOwnership);
router.put('/update', updateOwnership);
router.put('/delete', deleteOwnership);

export default router.getRouter();
