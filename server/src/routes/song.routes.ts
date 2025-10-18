import {
  createSong,
  getSong,
  getSongView,
  updateSong,
  deleteSong,
  searchSongs,
} from '../controllers/song.controllers';
import { createPermissionRouter } from '../policies';

const router = createPermissionRouter('/songs');

router.post('/create', createSong);
router.get('/get', getSong);
router.get('/get-view', getSongView);
router.put('/update', updateSong);
router.put('/delete', deleteSong);
router.get('/search', searchSongs);

export default router.getRouter();
