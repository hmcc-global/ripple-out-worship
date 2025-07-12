import { extendTheme } from '@chakra-ui/react';

// Define color palette to avoid hardcoded colors throughout the app
const colors = {
  brand: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Primary brand color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  accent: {
    50: '#fef7f0',
    100: '#feebc8',
    200: '#fbd38d',
    300: '#f6ad55',
    400: '#ed8936',
    500: '#dd6b20', // Secondary accent color
    600: '#c05621',
    700: '#9c4221',
    800: '#7b341e',
    900: '#652b19',
  },
  semantic: {
    success: '#38a169',
    warning: '#ed8936',
    error: '#e53e3e',
    info: '#3182ce',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// Common styling for action buttons
const buttonStyles = {
  baseStyle: {
    fontWeight: 'semibold',
    borderRadius: 'md',
  },
  variants: {
    primary: {
      bg: 'brand.500',
      color: 'white',
      _hover: {
        bg: 'brand.600',
      },
      _active: {
        bg: 'brand.700',
      },
    },
    secondary: {
      bg: 'gray.100',
      color: 'gray.800',
      _hover: {
        bg: 'gray.200',
      },
      _active: {
        bg: 'gray.300',
      },
    },
    outline: {
      border: '2px solid',
      borderColor: 'brand.500',
      color: 'brand.500',
      bg: 'transparent',
      _hover: {
        bg: 'brand.50',
      },
      _active: {
        bg: 'brand.100',
      },
    },
  },
  sizes: {
    sm: {
      px: 3,
      py: 2,
      fontSize: 'sm',
    },
    md: {
      px: 4,
      py: 2,
      fontSize: 'md',
    },
    lg: {
      px: 6,
      py: 3,
      fontSize: 'lg',
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'primary',
  },
};

// Common divider styles
const dividerStyles = {
  baseStyle: {
    borderColor: 'gray.200',
    borderWidth: '1px',
    opacity: 1,
  },
  variants: {
    solid: {
      borderStyle: 'solid',
    },
    dashed: {
      borderStyle: 'dashed',
    },
    thick: {
      borderWidth: '2px',
      borderColor: 'gray.300',
    },
  },
  defaultProps: {
    variant: 'solid',
  },
};

// Custom theme extending Chakra UI defaults
const theme = extendTheme({
  colors,
  components: {
    Button: buttonStyles,
    Divider: dividerStyles,
  },
  // Global styles
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  // Responsive breakpoints
  breakpoints: {
    sm: '30em', // 480px
    md: '48em', // 768px
    lg: '62em', // 992px
    xl: '80em', // 1280px
    '2xl': '96em', // 1536px
  },
});

export default theme;