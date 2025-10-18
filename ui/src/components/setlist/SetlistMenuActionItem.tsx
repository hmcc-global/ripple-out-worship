import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { FC } from 'react';

interface MenuActionItemProps {
  icon: React.ElementType;
  text: string;
  onClick: () => void;
  iconColor?: string;
  color?: string;
  hoverBgColor?: string;
}

const SetlistMenuActionItem: FC<MenuActionItemProps> = ({
  icon: Icon,
  text,
  onClick,
  iconColor = 'secondary.main',
  color = 'primary.lighter',
  hoverBgColor = 'primary.main',
}) => (
  <MenuItem onClick={onClick} sx={{ '&:hover': { bgcolor: hoverBgColor } }}>
    <ListItemIcon sx={{ color: iconColor }}>
      <Icon />
    </ListItemIcon>
    <ListItemText sx={{ color, fontSize: '0.75rem !important' }}>{text}</ListItemText>
  </MenuItem>
);

export default SetlistMenuActionItem;
