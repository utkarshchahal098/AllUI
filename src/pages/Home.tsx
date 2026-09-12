import { Box, Typography, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Home() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to MyUI
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        A practice app with MUI, Redux Toolkit and React Router.
      </Typography>
      <Button component={RouterLink} to="/store" variant="contained" size="large">
        Go to Store
      </Button>
    </Box>
  )
}

export default Home
