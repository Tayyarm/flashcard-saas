'use client'
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { collection, doc, getDoc, setDoc, writeBatch } from "firebase/firestore"
import { db } from "@/firebase"
import { Typography, Container, Paper, TextField, Button, Card, CardActions, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, Box, CircularProgress } from "@mui/material"

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        setLoading(true)
        fetch('api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        })
        .then((res) => res.json())
        .then((data) => {
            setFlashcards(data)
            setLoading(false)
        })
    };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    };

    const saveFlashcards = async () => {
        if (!isLoaded || !isSignedIn) {
            alert("User not signed in or not fully loaded. Please wait or sign in.");
            return;
        }

        if (!name) {
            alert("Please enter a name");
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert('Flashcards collection with the same name already exists.');
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Box 
                sx={{
                    mt: 4,
                    mb: 6,
                    display: 'flex',
                    flexDirection: 'column', 
                    alignItems: 'center'
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#673ab7' }}>
                    Generate Flashcards
                </Typography>
                <Paper sx={{ p: 4, width: "100%", backgroundColor: '#f3e5f5' }}>
                    <TextField 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        label="Enter text" 
                        fullWidth
                        multiline 
                        rows={4}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <Button 
                        variant='contained' 
                        color='primary' 
                        onClick={handleSubmit} 
                        fullWidth
                        sx={{
                            background: 'linear-gradient(to right, #673ab7, #9c27b0)',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#512da8',
                            },
                        }}
                    >
                        Submit
                    </Button>
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    )}
                </Paper>
            </Box>
            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}> 
                    <Typography variant='h5' sx={{ color: '#673ab7' }}>Flashcards Preview</Typography> 
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ backgroundColor: '#f3e5f5', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', borderRadius: 2 }}>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
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
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
                                                        backgroundColor: '#f3e5f5',
                                                        color: '#673ab7',
                                                    },
                                                    '& > div > .front': {
                                                        backgroundColor: '#f3e5f5',
                                                        color: '#673ab7',
                                                    },
                                                }}
                                            >
                                                <div>
                                                    <div className="front">
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div className="back">
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.back}
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
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant='contained' color='secondary' onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection.
                    </DialogContentText>
                    <TextField 
                        autoFocus 
                        margin='dense'
                        label="Collection Name" 
                        type="text"
                        fullWidth 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
