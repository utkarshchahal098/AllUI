import { Box, Card, CardContent, Typography, Button, Grid } from '@mui/material'
import { useAppDispatch } from '../store/hooks'
import { addItem } from '../store/cartSlice'

const products = [
  { id: 'p1', name: 'Keyboard', price: 79 },
  { id: 'p2', name: 'Mouse', price: 39 },
  { id: 'p3', name: 'Monitor', price: 199 },
  { id: 'p4', name: 'Headphones', price: 129 },
]

function Store() {
  const dispatch = useAppDispatch()

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Store
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  ${product.price}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => dispatch(addItem(product))}
                >
                  Add to cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Store
