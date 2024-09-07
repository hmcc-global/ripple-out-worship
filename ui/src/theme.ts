import { createTheme, PaletteOptions, SimplePaletteColorOptions } from '@mui/material/styles';
import '@fontsource/work-sans';
import '@fontsource/dm-sans';
import '@mui/material/styles';

// const PRIMARY_MAIN = '#4B50B4';
const PRIMARY_MAIN = '#4F378B';
const PRIMARY_LIGHT = '#C9CDFF';
// const PRIMARY_LIGHTER = '#DDE0FF';
const PRIMARY_LIGHTER = '#E6E0E9';
// const PRIMARY_LIGHTEST = '#EEEFFF';
const PRIMARY_LIGHTEST = '#EADDFF';
const PRIMARY_DARK = '#6750A4';
const PRIMARY_DARKER = '#1D192B';
const PRIMARY_DARKEST = '#141218';

const SECONDARY_MAIN = '#D0BCFE';
const SECONDARY_LIGHT = '#EADDFF'; // grey
const SECONDARY_LIGHTER = '#4A4458'; // purple grey
const SECONDARY_DARK = '#332D41'; // dark grey

const WARNING_MAIN = '#EFB8C8';

declare module '@mui/material/styles/createPalette' {
  interface PaletteColor {
    lighter?: string;
    lightest?: string;
    darker?: string;
    darkest?: string;
    contrastText: string;
  }
}
interface ExtendedPaletteColorOptions extends SimplePaletteColorOptions {
  darker?: string;
  lighter?: string;
  lightest?: string;
  darkest?: string;
}

interface ExtendedPaletteOptions extends PaletteOptions {
  primary: ExtendedPaletteColorOptions;
  secondary: ExtendedPaletteColorOptions;
}
const palette: ExtendedPaletteOptions = {
  primary: {
    main: PRIMARY_MAIN,
    light: PRIMARY_LIGHT,
    lighter: PRIMARY_LIGHTER,
    lightest: PRIMARY_LIGHTEST,
    dark: PRIMARY_DARK,
    darker: PRIMARY_DARKER,
    darkest: PRIMARY_DARKEST,
  },
  secondary: {
    main: SECONDARY_MAIN,
    light: SECONDARY_LIGHT,
    lighter: SECONDARY_LIGHTER,
    dark: SECONDARY_DARK,
  },
  background: {
    default: '#171717',
    paper: '#0F0D13',
  },
  warning: {
    main: WARNING_MAIN,
  },
  text: {
    primary: '#fff',
  },
};
const customTheme = createTheme({
  palette: palette,
  typography: {
    htmlFontSize: 16,
    fontFamily: ['Work Sans', 'DM Sans'].join(','),
    h1: {
      fontSize: '2rem', // Equivalent to 32px (16 * 2)
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem', // Equivalent to 24px (16 * 1.5)
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.25rem', // Equivalent to 20px (16 * 1.25)
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.125rem', // Equivalent to 18px (16 * 1.125)
      fontWeight: 700,
    },
    h5: {
      fontSize: '1rem', // Equivalent to 16px (16 * 1)
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: '1rem', // Equivalent to 16px (16 * 1)
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: '0.875rem', // Equivalent to 14px (16 * 0.875)
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem', // Equivalent to 16px (16 * 1)
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem', // Equivalent to 14px (16 * 0.875)
      fontWeight: 400,
    },
    caption: {
      fontSize: '0.6875rem', // Equivalent to 11px (16 * 0.0.6875)
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem', // Equivalent to 14px (16 * 0.875)
      fontWeight: 600,
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: PRIMARY_LIGHTER,
          '&.Mui-focused': {
            color: 'PRIMARY_LIGHTER',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          background: '#1D1B20',
          border: '1px solid {theme.palette.primary.main}',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#938F99',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& label': {
            color: PRIMARY_LIGHTER,
            '&.Mui-focused': {
              color: PRIMARY_LIGHTER,
            },
          },
        },
        paper: {
          backgroundColor: '#1D1B20',
          color: PRIMARY_LIGHTER,
        },
        popupIndicator: {
          color: PRIMARY_LIGHTER,
        },
        option: {
          '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            color: PRIMARY_LIGHTER,
          },
          '& ::placeholder': {
            color: PRIMARY_LIGHTER,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: PRIMARY_LIGHTER,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: PRIMARY_DARKEST, // Set the background color of the menu
          color: PRIMARY_LIGHTER, // Set the text color of the menu
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: PRIMARY_DARK, // Set the hover background color of the menu items
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2B2930', // Set the background color of the drawer
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2B2930', // Set the background color of the dialog
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: PRIMARY_DARKEST,
            '&:hover': {
              backgroundColor: PRIMARY_DARKEST,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '30px',
        },
      },
    },
  },
});

export default customTheme;
