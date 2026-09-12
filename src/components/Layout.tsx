import { Outlet } from 'react-router-dom'
import { Container } from '@mui/material'
import Navbar from './Navbar'

function Layout() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" component="main">
        <Outlet />
      </Container>
    </>
  )
}

export default Layout
