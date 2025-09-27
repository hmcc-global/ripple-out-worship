import { FC, SyntheticEvent } from 'react';
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  TextField,
} from '@mui/material';

type AutocompleteInputProps = {
  id: string;
  options: string[];
  label: string;
  autoComplete: string;
  value: string | string[] | null;
  onChange: (
    event: SyntheticEvent<Element, Event>,
    value: string | string[] | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<any> | undefined
  ) => void;
  register: any;
  renderTags?: (value: readonly string[], getTagProps: any) => JSX.Element[];
  freeSolo?: boolean;
  multiple?: boolean;
  getOptionDisabled?: (option: string) => boolean;
  helperText?: string;
  required?: boolean;
};

const AutocompleteInput: FC<AutocompleteInputProps> = ({
  id,
  options,
  label,
  autoComplete,
  value,
  onChange,
  register,
  renderTags,
  freeSolo,
  multiple,
  getOptionDisabled,
  helperText,
  required = false,
}) => {
  return (
    <Autocomplete
      multiple={multiple}
      freeSolo={freeSolo}
      id={id}
      options={options}
      getOptionLabel={(option) => option}
      getOptionDisabled={getOptionDisabled}
      filterSelectedOptions
      onChange={onChange}
      value={value}
      renderTags={renderTags}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            variant="outlined"
            label={label}
            helperText={helperText}
            {...register(id)}
            inputProps={{
              ...params.inputProps,
              autoComplete: autoComplete,
              required: required,
            }}
          />
        </>
      )}
      slotProps={{
        clearIndicator: {
          'aria-label': 'Clear all selected folders',
        },
      }}
    />
  );
};

export default AutocompleteInput;
