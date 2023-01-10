import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Button, MenuItem, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import { updateText } from '../util/input'
function TermInput(props) {

    const term = props.term

    return (
        <Dialog open={props.show} onClose={props.onClose} fullWidth>
            <DialogTitle>
                {props.term.greek.length > 0 ? "Edit Term" : "Add term"}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ padding: '5px' }}>
                    <TextField
                        label="term"
                        value={term.greek}
                        inputProps={{style: {fontFamily: "tahoma", fontSize: "18px"}}}
                        variant="outlined"
                        onChange={e => props.setTerm({ ...term, greek: updateText(e) })} />
                    <TextField label="definition" value={term.english} onChange={e => props.setTerm({ ...term, english: e.target.value })} />


                    <TextField
                        label={"Part of Speech"}
                        value={term.type}
                        onChange={e => props.setTerm({ ...term, type: e.target.value })}
                        fullWidth
                        select
                    >

                        <MenuItem value={'verb'}>Verb</MenuItem>
                        <MenuItem value={'noun'}>Noun</MenuItem>
                        <MenuItem value={'adjective'}>Adjective</MenuItem>
                        <MenuItem value={'other'}>Other</MenuItem>
                    </TextField>

                    <TextField
                        label="Special Case"
                        value={term.takesCase}
                        onChange={e => props.setTerm({ ...term, takesCase: e.target.value })}
                        fullWidth
                        select
                    >
                        <MenuItem value={'NA'}>NA</MenuItem>
                        <MenuItem value='nominative'>Nominative</MenuItem>
                        <MenuItem value='genitive'>Genitive</MenuItem>
                        <MenuItem value='dative'>Dative</MenuItem>
                        <MenuItem value='accusative'>Accusative</MenuItem>
                        <MenuItem value='vocative'>Vocative</MenuItem>

                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={props.add}>Save</Button>
                <Button variant="outlined" onClick={props.onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )

}

export default TermInput