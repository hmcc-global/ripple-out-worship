import {
  createSong,
  getSong,
  getSongView,
  updateSong,
  deleteSong,
  searchSongs,
} from '../controllers/song.controllers';
import { isLoggedIn, isAdmin } from '../policies';
import { Router } from 'express';

const songRouter = Router();

songRouter.post('/create', createSong);
songRouter.get('/get', [isLoggedIn, isAdmin], getSong);
songRouter.get('/get-view', getSongView);
songRouter.put('/update', updateSong);
songRouter.put('/delete', deleteSong);
songRouter.get('/search', [isLoggedIn, isAdmin], searchSongs);

export default songRouter;
