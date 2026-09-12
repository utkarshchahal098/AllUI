import { Box, Typography, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Page not found.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Back home
      </Button>
    </Box>
  )
}

export default NotFound
