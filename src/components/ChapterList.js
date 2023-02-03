
import { useDispatch, useSelector } from 'react-redux'



import { addChapter, deleteChapter, moveUp, moveDown, addFolder, moveChapter } from '../state/contentSlice'
import { go, CHAPTER_VIEW, VOCAB_QUIZ } from '../state/navSlice'

import Folders from './Folders'


function ChapterList() {
    const dispatch = useDispatch()
    const chapters = useSelector(state => state.content.content.chapters)
    const readOnly = useSelector(state => state.content.readOnly)


    return (
        <Folders 
            add={description => dispatch(addChapter(description))}
            remove={description => dispatch(deleteChapter(description))}
            primary={description => dispatch(go([CHAPTER_VIEW, { chapterName: description }]))}
            secondary={description => dispatch(go([VOCAB_QUIZ, { chapterName: description }]))}
            secondaryText={c => c.words ? `${c.words.length} terms` : '' }
            actionLabel="Practice"
            addFolder={description => dispatch(addFolder(description)) }  
            moveItem={params => dispatch(moveChapter(params))}     
            list={chapters}
            readOnly={readOnly}
            isFolder={c => !c.words}
            moveUp={description => dispatch(moveUp(description))}              
            moveDown={description => dispatch(moveDown(description))}         
            title="Chapter"     
        />
    )

}

export default ChapterList