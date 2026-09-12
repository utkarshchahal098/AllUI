import { Box, Typography } from '@mui/material'

function About() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        About
      </Typography>
      <Typography color="text.secondary">
        MyUI is a practice project for exploring Material UI, Redux Toolkit and React Router.
      </Typography>
    </Box>
  )
}

export default About
