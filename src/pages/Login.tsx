import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material'
import { loginSchema } from '../schemas/loginSchema'
import type { LoginFormValues } from '../schemas/loginSchema'

function Login() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
    mode: 'onBlur',
  })

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null)
    setSubmitSuccess(false)
    try {
      // TODO: replace with a real auth request
      await new Promise((resolve) => setTimeout(resolve, 600))
      console.log('login', values)
      setSubmitSuccess(true)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }} variant="outlined">
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Signed in successfully.
          </Alert>
        )}
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Controller
            name="rememberMe"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={value} onChange={(e) => onChange(e.target.checked)} />}
                label="Remember me"
              />
            )}
          />

          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default Login
