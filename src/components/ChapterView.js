import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from '@mui/material/Container'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { IconButton, ListItemText, Typography, Button, ButtonGroup } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { compareTypes, compareGreek } from '../util/greek'
import TermInput from './TermInput'
import { addTerm, deleteTerm } from '../state/contentSlice'
import { go, CHAPTER_LIST, VOCAB_QUIZ } from '../state/navSlice'

const blankTerm = {
    greek: '',
    english: '',
    takesCase: 'NA',
    type: 'verb'
}

function ChapterView() {
    const dispatch = useDispatch()
    const { chapterName } = useSelector(state => state.nav.params)
    const { description, words } = useSelector(state => state.content.content.chapters.filter(c => c.description == chapterName)[0])
    const readOnly = useSelector(state => state.content.readOnly)

    const [showDialog, setShowDialog] = useState(false)

    const [term, setTerm] = useState(blankTerm)

    const doAdd = () => {
        dispatch(addTerm([description, term]))
        setShowDialog(false)
    }

    const onEdit = t => {
        setTerm({ ...t, initialGreek: t.greek })
        setShowDialog(true)
    }

    const onNew = () => {
        setTerm(blankTerm)
        setShowDialog(true)
    }



    const compareTerms = (a, b) => {
        if (compareTypes(a.type, b.type) != 0) return compareTypes(a.type, b.type)
        return compareGreek(a.greek, b.greek)
    }


    return (
        <Container>
            <TermInput onClose={() => setShowDialog(false)} add={doAdd} show={showDialog} term={term} setTerm={setTerm} />
            <Typography variant="h5" component="h5">{chapterName}</Typography>            
            <List style={{ maxHeight: '70vh', overflowY: 'auto', marginTop: "5px", border: '1px solid #b7cbeb', borderRadius: '2px' }}>
                {words.slice().sort(compareTerms).map(t => {
                    return (
                        <ListItem key={t.greek} secondaryAction={
                            <IconButton
                                onClick={() => dispatch(deleteTerm([description, t.greek]))}
                                disabled={readOnly}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }>
                        
                            <ListItemText
                                primary={<>{t.greek.replaceAll(',', ', ')}<em style={{fontSize: '18px', color: '#4380e0'}}>{(t.takesCase != 'NA' ? (' + ' + t.takesCase) : '')}</em></>}
                                secondary={t.english} 
                                primaryTypographyProps={{ style: {fontFamily: "tahoma", fontSize: '22px'} }} 
                                secondaryTypographyProps={{ style: {fontSize: '15px'} }} />
                            
                            <IconButton onClick={() => onEdit(t)} disabled={readOnly} style={{marginRight: '12px'}}>
                                <EditIcon />
                            </IconButton>
                        </ListItem>
                    )
                })}
            </List>
            <ButtonGroup style={{ marginTop: '15px' }}>
                <Button variant="outlined" onClick={onNew} disabled={readOnly}>Add term</Button>
                <Button variant="outlined" onClick={() => dispatch(go([VOCAB_QUIZ, { chapterName }]))}>Practice</Button>
                <Button variant="outlined" onClick={() => dispatch(go([CHAPTER_LIST, {}]))}>Back to List</Button>
            </ButtonGroup>
        </Container>
    )

}

export default ChapterView