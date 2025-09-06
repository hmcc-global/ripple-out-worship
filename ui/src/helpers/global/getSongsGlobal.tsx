import { fetchSongs } from '../../reducers';
import { customAxios as axios } from '../../components/custom/customAxios';
import { AnyAction, Dispatch } from 'redux';

const getSongsGlobal = async (dispatch: Dispatch<AnyAction>) => {
  try {
    const { data, status } = await axios.get('/api/songs/get');
    if (status === 200) {
      dispatch(fetchSongs(data));
    }
  } catch (e) {
    console.log(e);
  }
};
export default getSongsGlobal;
