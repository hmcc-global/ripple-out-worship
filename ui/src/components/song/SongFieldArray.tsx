import { FieldArrayProps } from '../../types/song.types';
import { Typography, Stack, Chip } from '@mui/material';

const SongFieldArray = ({ data }: FieldArrayProps) => {
  if (Array.isArray(data)) {
    if (data.length === 0) return <Typography color={'#CCC2DC'}>-</Typography>;
    return (
      <Stack spacing={1} direction="row" flexWrap="wrap">
        {data.map((item: string, i: number) => {
          return (
            <Chip size="small" key={i} label={item} sx={{ bgcolor: '#2B2930', color: '#CCC2DC' }} />
          );
        })}
      </Stack>
    );
  }
  return null;
};

export default SongFieldArray;
