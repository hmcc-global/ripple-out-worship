import { Box, Stack, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { ElementType, FC, ReactElement } from 'react';

type HeaderWithIconProps = {
  Icon: ElementType;
  headerText: string;
  headerVariant: Variant;
  iconColor?: string;
  headerColor?: string;
};

const HeaderWithIcon: FC<HeaderWithIconProps> = ({
  Icon,
  headerText,
  headerVariant,
  iconColor,
  headerColor,
}): ReactElement => {
  return (
    <Box
      style={{
        marginBottom: '8px',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Icon sx={{ color: iconColor }} />

        <Typography variant={headerVariant} sx={{ color: headerColor }}>
          {headerText}
        </Typography>
      </Stack>
    </Box>
  );
};

export default HeaderWithIcon;
