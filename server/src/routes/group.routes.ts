import { createGroup, getGroup, updateGroup, deleteGroup } from '../controllers/group.controllers';
import { createPermissionRouter } from '../policies';

const router = createPermissionRouter('/groups');

router.post('/create', createGroup);
router.get('/get', getGroup);
router.put('/update', updateGroup);
router.put('/delete', deleteGroup);

export default router.getRouter();
