import { FieldArrayProps } from '../../types/song.types';
import { Typography, Stack, Chip, useTheme } from '@mui/material';

const SongFieldArray = ({ data }: FieldArrayProps) => {
  const theme = useTheme();
  if (Array.isArray(data)) {
    if (data.length === 0) return <Typography color={theme.palette.secondary.main}>-</Typography>;
    return (
      <Stack spacing={1} direction="row">
        {data.map((item: string, i: number) => {
          return (
            <Chip size="small" key={i} label={item} sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.secondary.main }} />
          );
        })}
      </Stack>
    );
  }
  return null;
};

export default SongFieldArray;
