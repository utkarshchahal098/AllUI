import { Box, Typography, Grid, Card, CardContent, Divider } from '@mui/material'
import WidgetsIcon from '@mui/icons-material/Widgets'
import StorageIcon from '@mui/icons-material/Storage'
import AltRouteIcon from '@mui/icons-material/AltRoute'
import RuleIcon from '@mui/icons-material/Rule'

const stack = [
  {
    icon: <WidgetsIcon fontSize="large" color="primary" />,
    title: 'Material UI',
    description:
      'The component library behind every button, card and form field in this app, giving it a consistent, accessible look out of the box.',
  },
  {
    icon: <StorageIcon fontSize="large" color="primary" />,
    title: 'Redux Toolkit',
    description:
      'Centralised, predictable state management. The cart and counter slices live here, shared across pages and reflected instantly in the navbar.',
  },
  {
    icon: <AltRouteIcon fontSize="large" color="primary" />,
    title: 'React Router',
    description:
      'Client-side routing between Home, Store, Cart, Login, Sign up and this page, all sharing one persistent navbar via a layout route.',
  },
  {
    icon: <RuleIcon fontSize="large" color="primary" />,
    title: 'React Hook Form + Zod',
    description:
      'Schema-driven form validation for Login and Sign up, catching bad input before it ever reaches the network.',
  },
]

function About() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        About MyUI
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2, maxWidth: 760 }}>
        MyUI is a practice project built for exploring how a modern React front end fits
        together in practice, not just in isolated tutorials. Rather than a single demo
        component, it's a small but complete app: a navbar, routed pages, shared state and
        validated forms, all wired to work the way they would in a real product.
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 760 }}>
        The goal isn't to ship features for their own sake, but to get comfortable with the
        everyday plumbing — how a click in one component updates a badge in another, how a
        page keeps its own URL without a full reload, and how a form can validate itself against
        a single shared schema instead of scattered manual checks.
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h5" gutterBottom>
        What's inside
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stack.map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  {item.icon}
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h5" gutterBottom>
        Under the hood
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
        The app is scaffolded with Vite and written in TypeScript throughout, so every slice of
        state, every route and every form value is typed end to end. It's intentionally kept
        small and readable — a place to try out a pattern, break it, and see exactly why it
        broke, rather than a production codebase.
      </Typography>
    </Box>
  )
}

export default About
