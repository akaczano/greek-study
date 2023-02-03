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

import {
    updateMiscChart,
    deleteMiscChart,
    addMiscChart,
    addMiscChartFolder,
    moveUpMiscChart,
    moveDownMiscChart,
    moveMiscChart
} from '../state/contentSlice'
import { CHART_PRACTICE, CHART_VIEW, go } from '../state/navSlice'
import Folders from './Folders';

function Charts() {
    const dispatch = useDispatch()
    const charts = useSelector(state => state.content.content.charts.slice())
    const readOnly = useSelector(state => state.content.readOnly)


    return (
        <Folders 
            add={description => dispatch(addMiscChart(description))}
            remove={description => dispatch(deleteMiscChart(description))}
            primary={description => dispatch(go([CHART_VIEW, { chartName: description }]))}
            secondary={description => dispatch(go([CHART_PRACTICE, { chartName: description }]))}
            secondaryText={c => '' }
            actionLabel="Practice"
            addFolder={description => dispatch(addMiscChartFolder(description)) }  
            moveItem={params => dispatch(moveMiscChart(params))}     
            list={charts}
            readOnly={readOnly}
            isFolder={c => !c.chart}
            moveUp={description => dispatch(moveUpMiscChart(description))}              
            moveDown={description => dispatch(moveDownMiscChart(description))}         
            title="Chart"     
        />
    )
}

export default Charts