import {
  getSongOption,
  createSongOption,
  getSongOptionList,
} from '../controllers/song-option.controllers';
import { createPermissionRouter } from '../policies';

// Currently not in use. Was planned to manage the song filters options i.e. themes, tempo etc.
const router = createPermissionRouter('/song-options');

router.post('/create', createSongOption);
router.get('/get', getSongOption);
router.get('/list', getSongOptionList);

export default router.getRouter();
