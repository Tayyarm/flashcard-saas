'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { Typography, Container, Box, Grid, Card, CardActionArea, CardContent } from "@mui/material"
import { useSearchParams } from "next/navigation"

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;
            const colRef = collection(db, 'users', user.id, search);
            const docs = await getDocs(colRef);
            const flashcards = [];

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            });

            setFlashcards(flashcards);
            console.log(flashcards); // Debugging: Check fetched data
        }
        getFlashcard();
    }, [user, search]);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

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

            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                        <Card sx={{ 
                            backgroundColor: '#f3e5f5',
                            transition: 'transform 0.3s ease-in-out', 
                            '&:hover': { 
                                transform: 'scale(1.05)', 
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)' 
                            } 
                        }}>
                            <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                <CardContent>
                                    <Box
                                        sx={{
                                            perspective: '1000px',
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                                transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            },
                                            '& > div > div': {
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: "hidden",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: 2,
                                                boxSizing: 'border-box',
                                            },
                                            '& > div > .back': {
                                                transform: 'rotateY(180deg)',
                                            },
                                        }}
                                    >
                                        <div>
                                            <div className="front">
                                                <Typography variant="h5" component="div" sx={{ color: '#673ab7' }}>
                                                    {flashcard.front || 'No Front Text'} {/* Fallback content */}
                                                </Typography>
                                            </div>
                                            <div className="back">
                                                <Typography variant="h5" component="div" sx={{ color: '#673ab7' }}>
                                                    {flashcard.back || 'No Back Text'} {/* Fallback content */}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

