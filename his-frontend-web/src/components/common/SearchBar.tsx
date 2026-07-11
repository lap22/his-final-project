import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField, type TextFieldProps } from '@mui/material'

type SearchBarProps = Omit<TextFieldProps, 'onChange' | 'value'> & {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  ...props
}: SearchBarProps) {
  return (
    <TextField
      {...props}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        ...props.slotProps,
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          ...props.slotProps?.input,
        },
      }}
    />
  )
}
