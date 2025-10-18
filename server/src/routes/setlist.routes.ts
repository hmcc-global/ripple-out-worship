import {
  createSetlist,
  deleteSetlist,
  getSetlist,
  updateSetlist,
} from '../controllers/setlist.controllers';
import { createPermissionRouter } from '../policies';

const router = createPermissionRouter('/setlists');

router.post('/create', createSetlist);
router.get('/get', getSetlist);
router.put('/update', updateSetlist);
router.put('/delete', deleteSetlist);

export default router.getRouter();
