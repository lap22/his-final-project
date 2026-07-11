import { MenuItem, TextField, type TextFieldProps } from '@mui/material'

export interface AppSelectOption {
  label: string
  value: string
}

type AppSelectProps = Omit<TextFieldProps, 'select'> & {
  options: readonly AppSelectOption[]
}

export function AppSelect({ options, fullWidth = true, ...props }: AppSelectProps) {
  return (
    <TextField select fullWidth={fullWidth} {...props}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
