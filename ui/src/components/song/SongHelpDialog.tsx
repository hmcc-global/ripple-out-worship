import { FC } from 'react';
import { Typography } from '@mui/material';
import HelpDialog from '../custom/HelpDialog';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const SongHelpDialog: FC = () => {
  return (
    <>
      <HelpDialog
        icon={<HelpOutlineIcon />}
        title="Markdown Hints"
        content={
          <>
            <Typography color="secondary.light" mb={2}>
              Use curly brackets “{`{ }`}” to indicate sections <br />
              Use square brackets “[ ]” to indicate chords
            </Typography>
            <Typography color="secondary.light" fontWeight="700">
              Example:
            </Typography>
            <Typography color="secondary.light">
              {`{Verse 1}`} <br />
              [D]When the music [A]fades, all is stripped [Em]away <br />
              And I simply [A]come <br />
              [D]Longing just to [A]bring something that's of [Em]worth <br />
              That will bless Your [A]heart <br />
            </Typography>
          </>
        }
      />
    </>
  );
};

export default SongHelpDialog;
