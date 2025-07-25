import { FieldArrayProps } from '../../types/song.types';
import { Typography, Stack, Chip } from '@mui/material';

const SongFieldArray = ({ data }: FieldArrayProps) => {
  if (Array.isArray(data)) {
    if (data.length === 0) return <Typography color={'secondary.main'}>-</Typography>;
    return (
      <Stack spacing={1} direction="row">
        {data.map((item: string, i: number) => {
          return (
            <Chip size="small" key={i} label={item} sx={{ bgcolor: 'background.paper', color: 'secondary.main' }} />
          );
        })}
      </Stack>
    );
  }
  return null;
};

export default SongFieldArray;
