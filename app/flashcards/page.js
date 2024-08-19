'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { Card, CardActionArea, CardContent, Container, Grid, Typography, Box, Button } from "@mui/material"

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <Container maxWidth="100vw" sx={{ overflow: "hidden", py: 5 }}>
      <Typography 
        variant="h2" 
        gutterBottom 
        sx={{ 
          color: '#673ab7', 
          fontWeight: 'bold', 
          textAlign: 'center' 
        }}
      >
        Your Flashcard Collections
      </Typography>

      {flashcards.length === 0 ? (
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            mt: 4, 
            color: '#555' 
          }}
        >
          No flashcard collections found. Start creating your first set!
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                transition: 'transform 0.3s ease-in-out', 
                '&:hover': { 
                  transform: 'scale(1.05)', 
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)' 
                },
                backgroundColor: '#f3e5f5' 
              }}>
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#673ab7' }}>
                      {flashcard.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant='contained' 
          href="/" 
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
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}

