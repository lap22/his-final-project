import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material'
import { Controller, type FieldErrors, type Resolver, useForm } from 'react-hook-form'
import { z } from 'zod'

export type EntityFormValues = Record<string, string>

export interface EntityFormField {
  name: string
  label: string
  type?: 'text' | 'email' | 'number' | 'password' | 'date'
  options?: readonly { label: string; value: string }[]
}

interface EntityFormDialogProps {
  open: boolean
  title: string
  fields: readonly EntityFormField[]
  schema: z.ZodType<EntityFormValues>
  defaultValues: EntityFormValues
  submitLabel?: string
  isLoading?: boolean
  onClose: () => void
  onSubmit: (values: EntityFormValues) => void
}

function createZodResolver(schema: z.ZodType<EntityFormValues>): Resolver<EntityFormValues> {
  return (values) => {
    const result = schema.safeParse(values)

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      }
    }

    const errors: FieldErrors<EntityFormValues> = {}

    for (const issue of result.error.issues) {
      const fieldName = issue.path[0]

      if (typeof fieldName === 'string') {
        errors[fieldName] = {
          type: issue.code,
          message: issue.message,
        }
      }
    }

    return {
      values: {},
      errors,
    }
  }
}

export function EntityFormDialog({
  open,
  title,
  fields,
  schema,
  defaultValues,
  submitLabel = 'Save',
  isLoading = false,
  onClose,
  onSubmit,
}: EntityFormDialogProps) {
  const { control, handleSubmit, reset } = useForm<EntityFormValues>({
    resolver: createZodResolver(schema),
    values: defaultValues,
  })

  function handleClose() {
    reset(defaultValues)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
        {fields.map((field) => (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: controlField, fieldState }) => (
              <TextField
                {...controlField}
                select={Boolean(field.options)}
                label={field.label}
                type={field.type ?? 'text'}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                fullWidth
              >
                {field.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isLoading}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
