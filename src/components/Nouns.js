import { useState } from 'react'
import {
    Button,
    ButtonGroup,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    DialogContentText,
    Typography,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    TextField,
    Checkbox,
    MenuItem
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import TableViewIcon from '@mui/icons-material/TableView';
import { useDispatch, useSelector } from 'react-redux'

import { go, CHART_DISPLAY, CHART_QUIZ, NOUN_QUIZ } from '../state/navSlice'
import { updateChart, deleteChart } from '../state/contentSlice'

function Nouns() {
    const dispatch = useDispatch()
    let charts = useSelector(state => state.content.content.declensions.slice())
    const readOnly = useSelector(state => state.content.readOnly)

    const [description, setDescription] = useState(null)
    const [deleting, setDeleting] = useState(null)

    const [settings, setSettings] = useState(null)

    const add = () => {
        dispatch(updateChart({ description, pattern: '', chart: null }))
        setDescription(null)
    }

    const delChart = () => {
        dispatch(deleteChart(deleting))
        setDeleting(null)
    }

    return (
        <Container>
            <Dialog open={description != null} onClose={() => setDescription(null)} fullWidth>
                <DialogTitle>Create new chart
                </DialogTitle>
                <DialogContent>                                                
                    <TextField
                        sx={{ marginTop: '5px' }}
                        label="Description"
                        value={description}
                        fullWidth
                        onChange={e => setDescription(e.target.value)} />                        
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={add}>Add</Button>
                    <Button variant="outlined" onClick={() => setDescription(null)}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleting} onClose={() => setDeleting(null)}>
                <DialogTitle>Confirm deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete chart {deleting}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={delChart}>Confirm</Button>
                    <Button variant="outlined" onClick={() => setDeleting(null)}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={settings} onClose={() => setSettings(null)} >
                <DialogTitle>Noun Practice</DialogTitle>
                <DialogContent>
                    <Grid container rowSpacing={2} columnSpacing={2}>
                        <Grid item md={12}>
                            <FormControl>
                                <FormLabel>Mode</FormLabel>
                                <RadioGroup row>
                                    <FormControlLabel
                                        checked={settings?.mode == 0}
                                        control={<Radio />}
                                        label="Greek ⇒ English, case"
                                        onChange={e => setSettings({ ...settings, mode: e.target.checked ? 0 : 1 })}
                                        tabIndex={7} />
                                    <FormControlLabel
                                        checked={settings?.mode == 1}
                                        value={true}
                                        control={<Radio />}
                                        label="English, case ⇒ Greek"
                                        tabIndex={8}
                                        onChange={e => setSettings({ ...settings, mode: e.target.checked ? 1 : 0 })} />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item md={12} xs={12}>
                            <FormControl>
                                <FormLabel>Use chart</FormLabel>
                                <TextField
                                    select
                                    size="small"
                                    fullWidth
                                    value={settings?.filter}
                                    sx={{ marginTop: '4px' }}
                                    onChange={e => setSettings({ ...settings, filter: e.target.value })}>
                                    <MenuItem value='all'>All charts</MenuItem>
                                    {charts.map(c => {
                                        const { description } = c
                                        return (
                                            <MenuItem key={description + '_selectkey'} value={description}>{description}</MenuItem>
                                        )
                                    })}
                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <FormControl>
                                <FormLabel>Article Setting</FormLabel>
                                <FormControlLabel    
                                    label="Include article"                                
                                    control={<Checkbox checked={settings?.articles}
                                    onChange={e => setSettings({ ...settings, articles: e.target.checked })} />} />                                
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => dispatch(go([NOUN_QUIZ, { settings }]))}>Start</Button>
                    <Button variant="outlined" onClick={() => setSettings(null)}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Typography component="h5" variant="h5">Noun Forms</Typography>
            <List style={{ maxHeight: '65vh', overflowY: 'auto', marginTop: '5px', marginBottom: '5px', border: '1px solid #b7cbeb', borderRadius: '2px' }}>
                {charts?.sort((a, b) => a.description.localeCompare(b.description)).map(c => {
                    return (
                        <ListItem key={c.description}>
                            <ListItemButton onClick={() => dispatch(go([CHART_DISPLAY, { chartName: c.description }]))}>
                                <ListItemIcon><TableViewIcon /> </ListItemIcon>
                                <ListItemText primary={c.description} />
                            </ListItemButton>
                            <Button disabled={!c.chart} onClick={() => dispatch(go([CHART_QUIZ, { chartName: c.description }]))}>
                                Practice
                            </Button>
                            <IconButton onClick={() => setDeleting(c.description)} disabled={readOnly}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    )
                })}
            </List>
            <ButtonGroup>
                <Button variant="outlined" disabled={readOnly} onClick={() => setDescription('')}>
                    Add chart
                </Button>
                <Button variant="outlined" onClick={() => setSettings({ mode: 0, filter: 'all', articles: false })}>
                    Study
                </Button>
            </ButtonGroup>
        </Container>
    )
}

export default Nouns