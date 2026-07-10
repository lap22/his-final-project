import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { loginApi } from '@/api/auth.api'
import { useAuth } from '@/hooks/useAuth'
import { getLoginRedirectPath } from '@/routes/auth'
import { type LoginRequest } from '@/types/auth'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { control, handleSubmit } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess(session) {
      login(session)
      navigate(getLoginRedirectPath(session.role), { replace: true })
    },
  })

  function onSubmit(values: LoginRequest) {
    loginMutation.mutate(values)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        component="form"
        variant="outlined"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: '100%', maxWidth: 420, p: 4, borderRadius: 3 }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          HIS Web Portal
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Đăng nhập hệ thống
        </Typography>

        {loginMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Không thể đăng nhập. Vui lòng kiểm tra email và mật khẩu.
          </Alert>
        )}

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                autoComplete="email"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Mật khẩu"
                type="password"
                autoComplete="current-password"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          <Button type="submit" variant="contained" size="large" disabled={loginMutation.isPending}>
            Đăng nhập
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
