
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Container, Card, Typography, CardContent, CardActions } from '@mui/material';
import { useDispatch } from 'react-redux'


import NavBar from './NavBar';
import { CHAPTER_LIST, NOUNS, VERBS, go } from '../state/navSlice'


function Landing() {
    const dispatch = useDispatch()

    return (<>        
        <Container>
            <Grid container spacing={1.5} style={{ marginTop: '10px' }}>
                <Grid style={{ marginTop: '10px' }} md={12}>
                    <p>
                        θεωρία is your one stop shop for learning vocab, memorizing
                        verb forms, and practicing noun declension.
                    </p>
                </Grid>
                <Grid md={4} xs={12}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                Vocabulary
                            </Typography>
                            <Typography sx={{ fontSize: "15px", minHeight: '75px' }} color="text.secondary" >
                                Manage vocab lists and practice translating words from English to
                                Greek and Greek to English.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => dispatch(go([CHAPTER_LIST, {}]))}>Get started</Button>
                            <Button size="small">Learn more</Button>
                        </CardActions>
                    </Card>
                </Grid >
                <Grid md={4} xs={12}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                Nouns
                            </Typography>
                            <Typography sx={{ fontSize: "15px", minHeight: '75px' }} color="text.secondary" >
                                Manage and review endings for different groups of nouns, articles, and
                                pronouns. Practice declining random nouns.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => dispatch(go([NOUNS, {}]))}>Get started</Button>
                            <Button size="small">Learn more</Button>
                        </CardActions>
                    </Card>
                </Grid >
                <Grid md={4} xs={12}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                Verbs
                            </Typography>
                            <Typography sx={{ fontSize: "15px", minHeight: '75px' }} color="text.secondary" >
                                Manage, view, and practice verb forms for different tenses, voices, and
                                irregular verbs. Practice conjugation.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => dispatch(go([VERBS, {}]))}>Get started</Button>
                            <Button size="small">Learn more</Button>
                        </CardActions>
                    </Card>
                </Grid >
            </Grid>
        </Container>
    </>
    )
}

export default Landing