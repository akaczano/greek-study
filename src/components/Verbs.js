import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
    IconButton, 
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Button,
    Typography,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import TableViewIcon from '@mui/icons-material/TableView';

import { updateVerbChart, deleteVerbChart } from '../state/contentSlice'
import { go, VERB_DISPLAY, VERB_QUIZ } from '../state/navSlice'

function Verbs() {
    const dispatch = useDispatch()
    const charts = useSelector(state => state.content.content.verbs.slice())
    const readOnly = useSelector(state => state.content.readOnly)

    const [description, setDescription] = useState(null)

    return (
        <Container>
            <Dialog open={description != null} onClose={() => setDescription(null)} fullWidth>                
                <DialogTitle>Add verb chart</DialogTitle>                
                <DialogContent>                                            
                        <TextField
                            label="Description"
                            sx={{ marginTop: '10px'}}
                            fullWidth
                            value={description}
                            onChange={e => setDescription(e.target.value)} />
                    
                </DialogContent>
                <DialogActions>                    
                        <Button variant="outlined" onClick={() => { dispatch(updateVerbChart({ description, chart: null })); setDescription(null) }}>Add</Button>
                        <Button variant="outlined" onClick={() => setDescription(null)}>Cancel</Button>                    
                </DialogActions>
            </Dialog>

            <Typography variant="h5" component="h5">Verb Forms</Typography>
            <List style={{maxHeight: "70vh", overflowY: "auto", marginTop: "5px", border: '1px solid #b7cbeb', borderRadius: '2px' }}>
                {charts.sort((a, b) => a.description.localeCompare(b.description)).map(c => {
                    return (
                        <ListItem key={c.description}>
                            <ListItemButton onClick={() => dispatch(go([VERB_DISPLAY, { chartName: c.description }]))}>
                                <ListItemIcon><TableViewIcon /></ListItemIcon>
                                <ListItemText primary={c.description} />
                            </ListItemButton>
                            <Button variant="outlined" disabled={!c.chart} onClick={() => dispatch(go([VERB_QUIZ, { chartName: c.description }]))}>
                                Practice
                            </Button>
                            <IconButton onClick={() => { dispatch(deleteVerbChart(c.description)) }} disabled={readOnly}>
                                <DeleteIcon />
                            </IconButton>                            
                        </ListItem>
                    )
                })}
            </List>

            <Button style={{ marginTop: '15px' }} onClick={() => setDescription('')} disabled={readOnly} variant="outlined">
                Add chart
            </Button>
        </Container>
    )
}

export default Verbs