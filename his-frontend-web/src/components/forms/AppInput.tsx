import { TextField, type TextFieldProps } from '@mui/material'

export function AppInput({ fullWidth = true, ...props }: TextFieldProps) {
  return <TextField fullWidth={fullWidth} {...props} />
}
