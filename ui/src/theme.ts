import { createTheme, PaletteOptions, SimplePaletteColorOptions } from '@mui/material/styles';
import '@fontsource/work-sans';
import '@fontsource/dm-sans';
import '@mui/material/styles';
import { createBreakpoints } from '@mui/system';
const breakpoints = createBreakpoints({});

// Comprehensive color palette based on design system
const colors = {
  // Primary scheme
  primary: '#D0BCFE',
  surfaceTint: '#D0BCFF',
  onPrimary: '#381E72',
  primaryContainer: '#4F378B',
  onPrimaryContainer: '#EADDFF',
  
  // Secondary scheme  
  secondary: '#CCC2DC',
  onSecondary: '#332D41',
  secondaryContainer: '#4A4458',
  onSecondaryContainer: '#E8DEF8',
  
  // Tertiary scheme
  tertiary: '#EFB8C8',
  onTertiary: '#492532',
  tertiaryContainer: '#633B48',
  onTertiaryContainer: '#FFD8E4',
  
  // Error scheme
  error: '#F2B8B5',
  onError: '#601410',
  errorContainer: '#8C1D18',
  onErrorContainer: '#F9DEDC',
  
  // Background scheme
  background: '#141218',
  onBackground: '#E6E0E9',
  surface: '#141218',
  onSurface: '#E6E0E9',
  surfaceVariant: '#49454F',
  onSurfaceVariant: '#CAC4D0',
  outline: '#938F99',
  outlineVariant: '#49454F',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E6E0E9',
  inverseOnSurface: '#322F35',
  inversePrimary: '#6750A4',
  primaryFixed: '#EADDFF',
  onPrimaryFixed: '#21005D',
  primaryFixedDim: '#D0BCFF',
  onPrimaryFixedVariant: '#4F378B',
  
  // Secondary fixed
  secondaryFixed: '#E8DEF8',
  onSecondaryFixed: '#1D192B',
  secondaryFixedDim: '#CCC2DC',
  onSecondaryFixedVariant: '#4A4458',
  
  // Tertiary fixed
  tertiaryFixed: '#FFD8E4',
  onTertiaryFixed: '#31111D',
  tertiaryFixedDim: '#EFB8C8',
  onTertiaryFixedVariant: '#633B48',
  
  // Surface variants
  surfaceDim: '#141218',
  surfaceBright: '#3B383E',
  surfaceContainerLowest: '#0F0D13',
  surfaceContainerLow: '#1D1B20',
  surfaceContainer: '#211F26',
  surfaceContainerHigh: '#2B2930',
  surfaceContainerHighest: '#36343B'
};

declare module '@mui/material/styles/createPalette' {
  interface PaletteColor {
    lighter?: string;
    lightest?: string;
    darker?: string;
    darkest?: string;
    contrastText: string;
  }
  
  interface Palette {
    surfaceTint: string;
    onPrimary: string;
    onPrimaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;
    tertiary: PaletteColor;
    onTertiary: string;
    onTertiaryContainer: string;
    onError: string;
    onErrorContainer: string;
    onBackground: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    shadow: string;
    scrim: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    primaryFixed: string;
    onPrimaryFixed: string;
    primaryFixedDim: string;
    onPrimaryFixedVariant: string;
    secondaryFixed: string;
    onSecondaryFixed: string;
    secondaryFixedDim: string;
    onSecondaryFixedVariant: string;
    tertiaryFixed: string;
    onTertiaryFixed: string;
    tertiaryFixedDim: string;
    onTertiaryFixedVariant: string;
    surfaceDim: string;
    surfaceBright: string;
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
  }
  
  interface PaletteOptions {
    surfaceTint?: string;
    onPrimary?: string;
    onPrimaryContainer?: string;
    onSecondary?: string;
    onSecondaryContainer?: string;
    tertiary?: PaletteColorOptions;
    onTertiary?: string;
    onTertiaryContainer?: string;
    onError?: string;
    onErrorContainer?: string;
    onBackground?: string;
    onSurface?: string;
    surfaceVariant?: string;
    onSurfaceVariant?: string;
    outline?: string;
    outlineVariant?: string;
    shadow?: string;
    scrim?: string;
    inverseSurface?: string;
    inverseOnSurface?: string;
    inversePrimary?: string;
    primaryFixed?: string;
    onPrimaryFixed?: string;
    primaryFixedDim?: string;
    onPrimaryFixedVariant?: string;
    secondaryFixed?: string;
    onSecondaryFixed?: string;
    secondaryFixedDim?: string;
    onSecondaryFixedVariant?: string;
    tertiaryFixed?: string;
    onTertiaryFixed?: string;
    tertiaryFixedDim?: string;
    onTertiaryFixedVariant?: string;
    surfaceDim?: string;
    surfaceBright?: string;
    surfaceContainerLowest?: string;
    surfaceContainerLow?: string;
    surfaceContainer?: string;
    surfaceContainerHigh?: string;
    surfaceContainerHighest?: string;
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
  tertiary: ExtendedPaletteColorOptions;
}

const palette: ExtendedPaletteOptions = {
  primary: {
    main: colors.primary,
    light: colors.primaryFixedDim,
    lighter: colors.onBackground,
    lightest: colors.onPrimaryContainer,
    dark: colors.inversePrimary,
    darker: colors.onSecondaryFixed,
    darkest: colors.background,
  },
  secondary: {
    main: colors.secondary,
    light: colors.onPrimaryContainer,
    lighter: colors.secondaryContainer,
    dark: colors.onPrimaryContainer,
  },
  tertiary: {
    main: colors.tertiary,
    light: colors.tertiaryFixed,
    lighter: colors.tertiaryFixedDim,
    dark: colors.onTertiary,
    darker: colors.onTertiaryFixed,
    darkest: colors.tertiaryContainer,
  },
  background: {
    default: colors.background,
    paper: colors.surfaceContainerLowest,
  },
  error: {
    main: colors.error,
    light: colors.onErrorContainer,
    dark: colors.onError,
  },
  warning: {
    main: colors.tertiary,
  },
  text: {
    primary: colors.onSurface,
    secondary: colors.onSurfaceVariant,
  },
  // Extended color properties
  surfaceTint: colors.surfaceTint,
  onPrimary: colors.onPrimary,
  onPrimaryContainer: colors.onPrimaryContainer,
  onSecondary: colors.onSecondary,
  onSecondaryContainer: colors.onSecondaryContainer,
  onTertiary: colors.onTertiary,
  onTertiaryContainer: colors.onTertiaryContainer,
  onError: colors.onError,
  onErrorContainer: colors.onErrorContainer,
  onBackground: colors.onBackground,
  onSurface: colors.onSurface,
  surfaceVariant: colors.surfaceVariant,
  onSurfaceVariant: colors.onSurfaceVariant,
  outline: colors.outline,
  outlineVariant: colors.outlineVariant,
  shadow: colors.shadow,
  scrim: colors.scrim,
  inverseSurface: colors.inverseSurface,
  inverseOnSurface: colors.inverseOnSurface,
  inversePrimary: colors.inversePrimary,
  primaryFixed: colors.primaryFixed,
  onPrimaryFixed: colors.onPrimaryFixed,
  primaryFixedDim: colors.primaryFixedDim,
  onPrimaryFixedVariant: colors.onPrimaryFixedVariant,
  secondaryFixed: colors.secondaryFixed,
  onSecondaryFixed: colors.onSecondaryFixed,
  secondaryFixedDim: colors.secondaryFixedDim,
  onSecondaryFixedVariant: colors.onSecondaryFixedVariant,
  tertiaryFixed: colors.tertiaryFixed,
  onTertiaryFixed: colors.onTertiaryFixed,
  tertiaryFixedDim: colors.tertiaryFixedDim,
  onTertiaryFixedVariant: colors.onTertiaryFixedVariant,
  surfaceDim: colors.surfaceDim,
  surfaceBright: colors.surfaceBright,
  surfaceContainerLowest: colors.surfaceContainerLowest,
  surfaceContainerLow: colors.surfaceContainerLow,
  surfaceContainer: colors.surfaceContainer,
  surfaceContainerHigh: colors.surfaceContainerHigh,
  surfaceContainerHighest: colors.surfaceContainerHighest,
};
const customTheme = createTheme({
  palette: palette,
  typography: {
    htmlFontSize: 16,
    fontFamily: ['Work Sans', 'DM Sans'].join(','),
    h1: {
      fontSize: '2rem', // Equivalent to 32px (16 * 2)
      fontWeight: 700,
      [breakpoints.up('lg')]: {
        fontSize: '2.5rem',
      },
      [breakpoints.down('sm')]: {
        fontSize: '1.5rem',
      },
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
      [breakpoints.down('sm')]: {
        fontSize: '0.875rem',
      },
    },
    body2: {
      fontSize: '0.875rem', // Equivalent to 14px (16 * 0.875)
      fontWeight: 400,
      [breakpoints.down('sm')]: {
        fontSize: '0.8rem',
      },
    },
    caption: {
      fontSize: '0.6875rem', // Equivalent to 11px (16 * 0.0.6875)
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem', // Equivalent to 14px (16 * 0.875)
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.onBackground,
          '&.Mui-focused': {
            color: colors.onBackground,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: colors.onBackground,
          background: colors.surfaceContainerLow,
          border: `1px solid ${colors.primary}`,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.outline,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& label': {
            color: colors.onBackground,
            '&.Mui-focused': {
              color: colors.onBackground,
            },
          },
        },
        paper: {
          backgroundColor: colors.surfaceContainerLow,
          color: colors.onBackground,
        },
        popupIndicator: {
          color: colors.onBackground,
        },
        option: {
          '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            color: colors.onBackground,
          },
          '& ::placeholder': {
            color: colors.onBackground,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: colors.onBackground,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background,
          color: colors.onBackground,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: colors.inversePrimary,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.surfaceContainerHigh,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.surfaceContainerHigh,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: colors.background,
            '&:hover': {
              backgroundColor: colors.background,
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
