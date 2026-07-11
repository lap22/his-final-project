import { TextField, type TextFieldProps } from '@mui/material'

type DatePickerProps = Omit<TextFieldProps, 'type' | 'onChange' | 'value'> & {
  value: string
  onChange: (value: string) => void
}

export function DatePicker({ value, onChange, fullWidth = true, ...props }: DatePickerProps) {
  return (
    <TextField
      {...props}
      type="date"
      value={value}
      fullWidth={fullWidth}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        ...props.slotProps,
        inputLabel: {
          shrink: true,
          ...props.slotProps?.inputLabel,
        },
      }}
    />
  )
}
