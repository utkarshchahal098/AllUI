import { useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useAppSelector } from '../store/hooks'

const navItems = [
  { label: 'Store', to: '/store' },
  { label: 'About', to: '/about' },
]

function Navbar() {
  const location = useLocation()
  const cartCount = useAppSelector((s) => s.cart.items.length)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const closeMenu = () => setAnchorEl(null)

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 700, flexGrow: { xs: 1, md: 0 } }}
        >
          MyUI
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4, gap: 1, flexGrow: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.to}
              component={RouterLink}
              to={item.to}
              color="inherit"
              sx={{ fontWeight: location.pathname === item.to ? 700 : 400 }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <IconButton component={RouterLink} to="/cart" color="inherit" aria-label="cart">
            <Badge badgeContent={cartCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Button component={RouterLink} to="/login" variant="contained">
            Login
          </Button>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton component={RouterLink} to="/cart" color="inherit" aria-label="cart">
            <Badge badgeContent={cartCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" aria-label="menu" onClick={openMenu}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
            {navItems.map((item) => (
              <MenuItem
                key={item.to}
                component={RouterLink}
                to={item.to}
                onClick={closeMenu}
                selected={location.pathname === item.to}
              >
                {item.label}
              </MenuItem>
            ))}
            <MenuItem component={RouterLink} to="/login" onClick={closeMenu}>
              Login
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
