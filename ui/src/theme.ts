import { createTheme, PaletteOptions, SimplePaletteColorOptions } from '@mui/material/styles';
import '@fontsource/work-sans';
import '@fontsource/dm-sans';
import '@mui/material/styles';
import { createBreakpoints } from '@mui/system';
const breakpoints = createBreakpoints({});

const PRIMARY_MAIN = '#4F378B';
const PRIMARY_LIGHT = '#C9CDFF';
const PRIMARY_LIGHTER = '#E6E0E9';
const PRIMARY_LIGHTEST = '#EADDFF';
const PRIMARY_DARK = '#6750A4';
const PRIMARY_DARKER = '#1D192B';
const PRIMARY_DARKEST = '#141218';

const SECONDARY_MAIN = '#D0BCFE';
const SECONDARY_LIGHT = '#EADDFF';
const SECONDARY_LIGHTER = '#4A4458';
const SECONDARY_DARK = '#EADDFF';

const WARNING_MAIN = '#EFB8C8';

// Module augmentation to include @mui/x-date-pickers components
declare module '@mui/material/styles' {
  interface Components {
    MuiPickersPopper?: {
      styleOverrides?: {
        root?: {
          '& .MuiPaper-root'?: {
            backgroundColor?: string;
            color?: string;
            border?: string;
            borderRadius?: string;
            boxShadow?: string;
          };
          '& .MuiDayPicker-header .MuiTypography-root'?: {
            color?: string;
            fontSize?: string;
            fontWeight?: number;
          };
          '& .MuiDayCalendar-weekDayLabel'?: {
            color?: string;
            fontSize?: string;
            fontWeight?: number;
          };
        };
      };
    };
    MuiPickersCalendarHeader?: {
      styleOverrides?: {
        root?: {
          color?: string;
          '& .MuiIconButton-root'?: {
            color?: string;
            '&:hover'?: {
              backgroundColor?: string;
            };
          };
        };
        label?: {
          fontSize?: string;
        };
      };
    };
    MuiPickersToolbar?: {
      styleOverrides?: {
        root?: {
          color?: string;
          fontSize?: string;
        };
        '& .MuiTypography-root'?: {
          color?: string;
        };
      };
    };
    MuiDayCalendar?: {
      styleOverrides?: {
        root?: {
          color?: string;
          fontSize?: string;
        };
        '& .MuiDayCalendar-header .MuiTypography-root-MuiDayCalendar-weekDayLabel'?: {
          color?: string;
          fontSize?: string;
          fontWeight?: number;
        };
      };
    };
  }
}

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
  error?: ExtendedPaletteColorOptions;
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
  error: {
    main: WARNING_MAIN,
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
    fontFamily: ['DM Sans', 'Work Sans'].join(','),
    h1: {
      fontFamily: 'Work Sans',
      fontSize: '2rem',
      fontWeight: 700,
      [breakpoints.up('lg')]: {
        fontSize: '1.875rem',
      },
      [breakpoints.down('sm')]: {
        fontSize: '1.5rem',
      },
    },
    h2: {
      fontFamily: 'Work Sans',
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Work Sans',
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Work Sans',
      fontSize: '1.125rem',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Work Sans',
      fontSize: '1rem',
      fontWeight: 700,
    },
    subtitle1: {
      fontFamily: 'DM Sans',
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: 'DM Sans',
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontFamily: 'DM Sans',
      fontSize: '1rem',
      fontWeight: 400,
      [breakpoints.down('sm')]: {
        fontSize: '0.875rem',
      },
    },
    body2: {
      fontFamily: 'DM Sans',
      fontSize: '0.875rem',
      fontWeight: 400,
      [breakpoints.down('sm')]: {
        fontSize: '0.8rem',
      },
    },
    caption: {
      fontFamily: 'DM Sans',
      fontSize: '0.6875rem',
      fontWeight: 400,
    },
    button: {
      fontFamily: 'DM Sans',
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: PRIMARY_LIGHTER,
          '&.Mui-focused': {
            color: PRIMARY_LIGHTER,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: PRIMARY_LIGHTER,
          background: '#1D1B20',
          border: '1px solid {theme.palette.primary.main}',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#938F99',
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: PRIMARY_LIGHTER,
          '& .MuiButtonBase-root': {
            color: PRIMARY_LIGHTER,
            padding: '0.5rem',
            '&:hover': {
              color: '#fff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
            },
            '&.Mui-focused': {
              color: '#fff',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            },
            '& svg': {
              fontSize: '16px',
            },
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
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
          border: '1px solid #938F99',
        },
        listbox: {
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '8px 0',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#1D1B20',
          },
        },
        option: {
          color: PRIMARY_LIGHTER,
          fontSize: '0.875rem',
          padding: '8px 16px',
          '&:hover': {
            backgroundColor: PRIMARY_MAIN,
            color: '#fff',
          },
          '&[aria-selected="true"]': {
            backgroundColor: PRIMARY_DARK,
            color: '#fff',
          },
          '&.Mui-focused': {
            backgroundColor: PRIMARY_MAIN,
            color: '#fff',
          },
        },
        noOptions: {
          color: PRIMARY_LIGHTER,
          fontSize: '0.875rem',
          padding: '8px 16px',
          '&:hover': {
            backgroundColor: PRIMARY_MAIN,
            color: '#fff',
          },
          '&[aria-selected="true"]': {
            backgroundColor: PRIMARY_DARK,
            color: '#fff',
          },
          '&.Mui-focused': {
            backgroundColor: PRIMARY_MAIN,
            color: '#fff',
          },
        },
        popupIndicator: {
          color: PRIMARY_LIGHTER,
        },
        clearIndicator: {
          color: PRIMARY_LIGHTER,
          padding: '4px',
          '&:hover': {
            color: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          },
          '&.Mui-focused': {
            color: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          },
          '& svg': {
            fontSize: '16px',
          },
        },
      },
    },
    MuiPickersPopper: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            backgroundColor: '#2B2930',
            color: PRIMARY_LIGHTER,
            border: '1px solid #938F99',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
          },
          '& .MuiDayCalendar-weekDayLabel': {
            color: '#fff !important',
            fontSize: '0.875rem',
            fontWeight: 600,
          },
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          color: PRIMARY_LIGHTER,
          '& .MuiIconButton-root': {
            color: PRIMARY_LIGHTER,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
        label: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          color: '#FFF !important',
          fontSize: '1rem',
        },
        '& .MuiTypography-root': {
          color: '#FFF !important',
        },
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        root: {
          color: '#FFF !important',
          fontSize: '1rem',
        },
        '& .MuiDayCalendar-header .MuiTypography-root-MuiDayCalendar-weekDayLabel': {
          color: '#FFFFFF !important',
          fontSize: '0.875rem',
          fontWeight: 600,
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
          backgroundColor: PRIMARY_DARKEST,
          color: PRIMARY_LIGHTER,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: PRIMARY_DARK,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2B2930',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2B2930',
          color: PRIMARY_LIGHTER,
          border: '1px solid #938F99',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: 'Work Sans',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#fff',
          padding: '16px 24px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          fontFamily: 'DM Sans',
          fontSize: '1rem',
          fontWeight: 400,
          color: PRIMARY_LIGHTER,
          padding: '8px 24px',
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontFamily: 'DM Sans',
          fontSize: '1rem',
          fontWeight: 400,
          color: PRIMARY_LIGHTER,
          whiteSpace: 'pre-line', // Ensures \n is rendered as a line break
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '8px 24px 16px',
          '& .MuiButton-root': {
            borderRadius: '30px',
            fontSize: '0.875rem',
            fontWeight: 600,
            padding: '6px 16px',
          },
          '& .MuiButton-textPrimary': {
            color: SECONDARY_MAIN,
            '&:hover': {
              backgroundColor: 'rgba(208, 188, 255, 0.15)',
            },
          },
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
        containedError: {
          backgroundColor: WARNING_MAIN,
          color: PRIMARY_DARKEST,
          '&:hover': {
            backgroundColor: 'rgba(239, 184, 200, 0.2)',
            color: WARNING_MAIN,
          },
        },
        outlined: {
          border: '1px solid #938F99',
          '&:hover': {
            borderColor: SECONDARY_MAIN,
          },
        },
      },
    },
  },
});

export default customTheme;
