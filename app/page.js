'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Typography, Container, Box, Grid, Paper } from "@mui/material";
import Head from "next/head";

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch(`/api/checkout_session`, {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    })
    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.status === 500) {
      console.error(checkoutSession.message)
      return
    }
    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })
    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth="100vw" sx={{ overflow: "hidden", py: 5 }}>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static" sx={{ backgroundColor: '#673ab7' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          textAlign: "center",
          my: 8,
          animation: 'fadeIn 1.5s',
          '@keyframes fadeIn': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 }
          },
        }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#673ab7' }}>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ color: '#555' }}>
          The easiest way to make flashcards from your text
        </Typography>
        <SignedIn>
          <Box sx={{ display: 'inline-flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                mt: 4, 
                px: 4, 
                py: 1.5,
                background: 'linear-gradient(to right, #673ab7, #9c27b0)',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#512da8',
                },
              }}
              href="/generate"
            >
              Get Started
            </Button>
            <Button
              variant="contained"
              sx={{
                mt: 4, 
                px: 4, 
                py: 1.5,
                background: 'linear-gradient(to right, #673ab7, #9c27b0)',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#512da8',
                },
              }}
              href="/flashcards"
            >
              My Sets
            </Button>
          </Box>
        </SignedIn>
        <SignedOut>
          <Button
            variant="contained"
            sx={{
              mt: 4, 
              px: 4, 
              py: 1.5,
              background: 'linear-gradient(to right, #673ab7, #9c27b0)',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#512da8',
              },
            }}
            href="/sign-in"
          >
            Sign in to Get Started
          </Button>
        </SignedOut>
      </Box>

      <Box sx={{ my: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", color: '#673ab7' }}>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                backgroundColor: '#f3e5f5',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: '#e1bee7',
                  transform: 'scale(1.05)',
                },
              }}>
              <Typography variant="h6" gutterBottom>
                Easy Text Input
              </Typography>
              <Typography>
                Simply input your text and let our software do the rest. Creating flashcards has never been easier.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                backgroundColor: '#f3e5f5',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: '#e1bee7',
                  transform: 'scale(1.05)',
                },
              }}>
              <Typography variant="h6" gutterBottom>
                Smart Flashcards
              </Typography>
              <Typography>
                Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                backgroundColor: '#f3e5f5',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: '#e1bee7',
                  transform: 'scale(1.05)',
                },
              }}>
              <Typography variant="h6" gutterBottom>
                Accessible Anywhere
              </Typography>
              <Typography>
                Access your flashcards from any device, at any time. Study on the go with ease.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#673ab7' }}>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={5}>
            <Paper
              elevation={5}
              sx={{
                p: 4,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                background: 'linear-gradient(to right, #673ab7, #9c27b0)',
                color: '#fff',
                textAlign: 'center',
                height: '100%',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}>
              <Typography variant="h5" gutterBottom>
                Free
              </Typography>
              <Typography variant="h6" gutterBottom>
                $0/ month
              </Typography>
              <Typography>
                Access to basic flashcard features with limited storage. This is the default plan.
              </Typography>
              <Button variant="contained" sx={{ mt: 2, backgroundColor: '#fff', color: '#673ab7' }} disabled>
                Default Plan
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper
              elevation={5}
              sx={{
                p: 4,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                background: 'linear-gradient(to right, #673ab7, #9c27b0)',
                color: '#fff',
                textAlign: 'center',
                height: '100%',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}>
              <Typography variant="h5" gutterBottom>
                Pro
              </Typography>
              <Typography variant="h6" gutterBottom>
                $10/ month
              </Typography>
              <Typography>
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#fff', color: '#673ab7' }}
                onClick={handleSubmit}>
                Choose Pro
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}



