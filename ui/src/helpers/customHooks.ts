import axios from 'axios';
import { Setlist, SetlistFolder } from '../types/setlist.types';
import { SongSchema, SongViewSchema } from '../types/song.types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { updateAxiosClient } from '../components/custom/customAxios';
import { UserEditorFields } from '../types/user.types';

type RootState = {
  user: string;
  songs: SongSchema[] | SongViewSchema[];
  setlists: Setlist[];
  folders: SetlistFolder[];
};

export const useUser = (): { token: string; user?: UserEditorFields; loading: boolean } => {
  const token = useSelector((state: RootState) => state.user);
  const [user, setUser] = useState<UserEditorFields>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post('/external-api/auth/verify-token', {
          token: token,
        });
        updateAxiosClient(token);
        setUser(data);
      } catch (err: any) {
        if (err?.response?.data?.raw === 'token-expired') {
          localStorage.clear();
          window.location.reload();
        }
      }
    };
    fetchUser();
    setLoading(false);
  }, [token, loading, setLoading]);
  return { token, user: user, loading: loading };
};
export const useSongs = (id?: string) => {
  const allSongs = useSelector((state: RootState) => state.songs);
  if (id) {
    const song = allSongs.find((song) => song._id === id);
    return song;
  }
  return allSongs;
};

export const useSetlists = (id?: string) => {
  const allSetlists = useSelector((state: RootState) => state.setlists);
  if (id) {
    const setlist = allSetlists.find((setlist) => setlist._id === id);
    return setlist;
  }
  return allSetlists;
};

export const useFolders = (id?: string) => {
  const allFolders = useSelector((state: RootState) => state.folders);
  if (id) {
    const folder = allFolders.find((folder) => folder._id === id);
    return folder;
  }
  return allFolders;
};
