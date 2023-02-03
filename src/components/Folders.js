import { useState } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FolderIcon from '@mui/icons-material/Folder';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import { IconButton, ListItemButton, ListItemText, Collapse, Menu, MenuItem, ButtonGroup } from '@mui/material';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField';


function Folders(props) {

    const {
        add,
        remove,
        primary,
        secondary,
        actionLabel,
        secondaryText,
        addFolder,        
        moveItem,
        list,
        isFolder,
        moveUp,
        moveDown,
        title,
        readOnly
    } = props
    



    const [showModal, setShowModal] = useState(false)
    const [toDelete, setToDelete] = useState(null)
    const [description, setDescription] = useState('')
    const [expanded, setExpanded] = useState([])
    const [menuAnchors, setMenuAnchors] = useState(["", null])
    const [showFolderModal, setShowFolderModal] = useState(false)
    const [folderDescription, setFolderDescription] = useState('')
    const [moving, setMoving] = useState(null)
    const [dest, setDest] = useState(null)


    const addNew = () => {
        setDescription('')
        setShowModal(true)
    }

    const addNewFolder = () => {
        setFolderDescription('')
        setShowFolderModal(true)
    }

    const isValidName = s => {
        if (s.length < 1) return false
        return list.filter(c => c.description == s).length < 1
    }

    const renderList = (l, parent, style = {}) => {        
        const items = l.slice()
            .filter(c => c.parent == parent)
            .sort((a, b) => a.position - b.position)
        return (
            <List dense={false} style={style}>
                {items.map(i => isFolder(i) ? renderFolder(i) : renderItem(i))}
            </List>
        )
    }

    const getMenu = c => {
        const menuOpen = menuAnchors[0] == c.description
        const anchorEl = menuOpen ? menuAnchors[1] : null
        const hasChildren = list.filter(i => i.parent == c.description).length > 0

        return (
            <>
                <IconButton onClick={e => setMenuAnchors([c.description, e.currentTarget])}>
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="demo-positioned-menu"
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={() => setMenuAnchors(["", null])}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <MenuItem disabled={c.position == 0 || readOnly} onClick={() => { moveUp(c.description); setMenuAnchors(["", null]) }}>
                        <ListItemIcon><KeyboardArrowUpIcon /> </ListItemIcon>
                        <ListItemText>Move Up</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => { moveDown(c.description); setMenuAnchors(["", null]) }} disabled={readOnly}>
                        <ListItemIcon><KeyboardArrowDownIcon /> </ListItemIcon>
                        <ListItemText>Move Down</ListItemText>
                    </MenuItem>
                    <MenuItem disabled={readOnly} onClick={() => { setMoving(c); setMenuAnchors(["", null]) }}>
                        <ListItemIcon><DriveFileMoveIcon /></ListItemIcon>
                        <ListItemText>Move to Folder</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => { setToDelete(c.description); setMenuAnchors(["", null]) }} disabled={readOnly || hasChildren}>
                        <ListItemIcon><DeleteIcon /></ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                </Menu>
            </>
        )
    }

    const renderItem = c => {        
        const { description } = c        
        return (
            <ListItem key={description}>
                <ListItemButton onClick={() => primary(description)}>
                    <ListItemIcon> <DescriptionIcon /></ListItemIcon>
                    <ListItemText primary={description} secondary={secondaryText(c)} />
                </ListItemButton>
                <Button onClick={() => secondary(description)}>{actionLabel}</Button>
                {getMenu(c)}
            </ListItem>
        )
    }

    const renderFolder = f => {
        const { description } = f
        const open = expanded.includes(description)
        const handleClick = () => {
            if (open) {
                setExpanded(expanded.filter(i => i != description))
            }
            else {
                setExpanded([...expanded, description])
            }
        }
        return (
            <>
                <ListItem>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary={description} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                        {getMenu(f)}
                    </ListItemButton>
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {renderList(list, description, { marginLeft: '30px' })}
                </Collapse>
            </>
        )
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
                        Are you sure you want to delete the {title.toLowerCase()} <strong>{toDelete}</strong>? There will be
                        no way to restore it.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { remove(toDelete); setToDelete(null) }} color="error">Confirm</Button>
                    <Button onClick={() => setToDelete(null)} autoFocus>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth>
                <DialogTitle>Add {title}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="description"
                        fullWidth
                        variant="standard"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button onClick={() => { setShowModal(false); add(description) }} disabled={!isValidName(description)}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showFolderModal} onClose={() => setShowFolderModal(false)} fullWidth>
                <DialogTitle>Add Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="description"
                        fullWidth
                        variant="standard"
                        value={folderDescription}
                        onChange={e => setFolderDescription(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowFolderModal(false)}>Cancel</Button>
                    <Button onClick={() => { setShowFolderModal(false); addFolder(folderDescription) }} disabled={!isValidName(folderDescription)}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={moving} onClose={() => setMoving(null)} fullWidth>
                <DialogTitle>Move to Folder</DialogTitle>
                <DialogContent>
                    <DialogContentText>Select a folder to move {moving?.description} to.</DialogContentText>
                    <TextField
                        autoFocus
                        label="destination"
                        fullWidth
                        select
                        onChange={e => setDest(e.target.value)}
                    >
                        {list.filter(c => isFolder(c)).map(c => <MenuItem value={c.description}>{c.description}</MenuItem>)}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => { setMoving(null); moveItem([moving, dest]) }}>Move</Button>
                    <Button variant="outlined" onClick={() => setMoving(null)}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h5" component="h5">
                {title} List
            </Typography>
            {renderList(list, "", { maxHeight: '65vh', overflowY: 'auto', border: '1px solid #b7cbeb', borderRadius: '2px', marginTop: '5px' })}

            <ButtonGroup style={{ marginTop: '15px', marginBottom: '20px' }}>
                <Button variant="outlined" onClick={addNew} disabled={readOnly}>
                    New {title}
                </Button>
                <Button variant="outlined" disabled={readOnly} onClick={addNewFolder}>
                    New Folder
                </Button>
            </ButtonGroup>
        </Container>
    )
}

export default Folders