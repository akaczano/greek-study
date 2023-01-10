import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, ListItemButton, ListItemText } from '@mui/material';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField';

import { addChapter, deleteChapter } from '../state/contentSlice'
import { go, CHAPTER_VIEW, VOCAB_QUIZ } from '../state/navSlice'

function ChapterList(props) {
    const dispatch = useDispatch()
    const chapters = useSelector(state => state.content.content.chapters)
    const readOnly = useSelector(state => state.content.readOnly)

    const compareChapters = (a, b) => a.description.localeCompare(b.description)

    const [showModal, setShowModal] = useState(false)
    const [toDelete, setToDelete] = useState(null)
    const [description, setDescription] = useState('')

    const addNew = () => {
        setDescription('')
        setShowModal(true)
    }

    return (
        <Container>
            <Dialog
                open={toDelete}
                onClose={() => setToDelete(null)}
            >
                <DialogTitle>
                    {"Confirm Delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the chapter <strong>{toDelete}</strong>? There will be
                        no way to recover those terms.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { dispatch(deleteChapter(toDelete)); setToDelete(null) }} color="error">Confirm</Button>
                    <Button onClick={() => setToDelete(null)} autoFocus>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth>
                <DialogTitle>Add Chapter</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="description"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button onClick={() => { setShowModal(false); dispatch(addChapter(description)) }}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h5" component="h5">
                Chapter List
            </Typography>
            <List style={{ maxHeight: '65vh', overflowY: 'auto', border: '1px solid #b7cbeb', borderRadius: '2px', marginTop: '5px' }} dense={false}>
                {chapters.slice().sort(compareChapters).map(c => {
                    const {                        
                        last_studied,
                        words,
                        description
                    } = c

                    const message = last_studied ? `Last studied: ${new Date(last_studied).toLocaleDateString()}` : 'Never studied'

                    return (
                        <ListItem key={description} secondaryAction={
                            <IconButton edge="end" aria-label="delete" disabled={readOnly} onClick={() => setToDelete(description)}>
                                <DeleteIcon />
                            </IconButton>
                        }>
                            <ListItemButton onClick={() => dispatch(go([CHAPTER_VIEW, { chapterName: description }]))}>
                                <ListItemIcon> <DescriptionIcon /></ListItemIcon>
                                <ListItemText primary={description} secondary={`${words.length} terms`} />
                            </ListItemButton>
                            <Button onClick={() => dispatch(go([VOCAB_QUIZ, { chapterName: description}]))}>Practice</Button>
                        </ListItem>
                    )
                })}

            </List>

            <Button variant="outlined" style={{ marginTop: '15px', marginBottom: '20px' }} onClick={addNew} disabled={readOnly}>
                New Chapter
            </Button>
        </Container>
    )
}

export default ChapterList