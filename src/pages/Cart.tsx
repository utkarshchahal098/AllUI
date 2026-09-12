import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Divider,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { removeItem, clearCart } from '../store/cartSlice'

function Cart() {
  const items = useAppSelector((s) => s.cart.items)
  const dispatch = useAppDispatch()
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      {items.length === 0 ? (
        <Typography color="text.secondary">Your cart is empty.</Typography>
      ) : (
        <>
          <List>
            {items.map((item, index) => (
              <ListItem
                key={`${item.id}-${index}`}
                secondaryAction={
                  <IconButton edge="end" aria-label="remove" onClick={() => dispatch(removeItem(item.id))}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={item.name} secondary={`$${item.price}`} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Total: ${total}</Typography>
          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => dispatch(clearCart())}>
            Clear cart
          </Button>
        </>
      )}
    </Box>
  )
}

export default Cart
