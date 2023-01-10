import { useEffect, useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress } from '@mui/material';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import NavBar from './components/NavBar';
import ChapterList from './components/ChapterList';
import ChapterView from './components/ChapterView';
import VocabQuiz from './components/VocabQuiz';
import Landing from './components/Landing';
import Nouns from './components/Nouns';
import ChartDisplay from './components/ChartDisplay';
import NounQuiz from './components/NounQuiz';
import Verbs from './components/Verbs'
import VerbDisplay from './components/VerbDisplay'
import Keyboard from './components/Keyboard'

import {
  LANDING,
  CHAPTER_LIST,
  CHAPTER_VIEW,
  VOCAB_QUIZ,
  NOUNS,
  CHART_DISPLAY,
  CHART_QUIZ,
  NOUN_QUIZ,
  VERBS,
  VERB_DISPLAY,
  VERB_QUIZ,
  KEYBOARD
} from './state/navSlice'

import { setContent } from './state/contentSlice'

function App() {
  const dispatch = useDispatch()
  const location = useSelector(state => state.nav.location)
  const { content, readOnly, source } = useSelector(state => state.content)


  useEffect(() => {
    if (window.electronAPI) {
      dispatch(setContent({ content: window.electronAPI.loadVocab(), readOnly: false }))
    }
    else {
      fetch(source)
        .then((resp) => resp.json())
        .then((content) => {
          dispatch(setContent({ content, readOnly: true }))
        })
    }
  }, [source])

  useEffect(() => {
    if (!readOnly) {
      window.electronAPI.saveVocab(content)
    }
  }, [content])


  /*const addTerm = (chapterName, term) => {
    const chapter = vocab.filter(c => c.description == chapterName)[0]
    const otherChapters = vocab.filter(c => c.description != chapterName)

    const newVocab = [
      ...otherChapters,
      {
        ...chapter, words: [...chapter.words.filter(t => t.greek != term.initialGreek), {
          english: term.english,
          greek: term.greek,
          type: term.type,
          takesCase: term.takesCase
        }]
      }
    ]
    setVocab(newVocab)
  }

  const goBack = () => {
    setLocation(CHAPTER_LIST)
  }

  const deleteTerm = (chapterName, greek) => {
    const chapter = vocab.filter(c => c.description == chapterName)[0]
    const otherChapters = vocab.filter(c => c.description != chapterName)
    const newVocab = [
      ...otherChapters,
      { ...chapter, words: chapter.words.filter(w => w.greek != greek) }
    ]
    setVocab(newVocab)
  }


  const studyComplete = chapterName => {
    if (readonly) return
    const chapter = vocab.filter(c => c.description == chapterName)[0]
    const otherChapters = vocab.filter(c => c.description != chapterName)

    const newVocab = [
      ...otherChapters,
      { ...chapter, attempts: chapter.attempts + 1, last_studied: new Date() }
    ]
    setVocab(newVocab)
  }


  const updateChart = chart => {
    const newCharts = [...charts.filter(c => c.description != chart.description), chart]
    setCharts(newCharts)
  }

  const deleteChart = chartName => {
    setCharts([...charts.filter(c => c.description != chartName)])
  }

  const updateVerbChart = chart => {
    const newVerbs = [...verbCharts.filter(c => c.description != chart.description), chart]
    setVerbCharts(newVerbs)
  }

  const deleteVerbChart = chartName => {
    setVerbCharts([...verbCharts.filter(c => c.description != chartName)])
  }*/

  const getComponentTitle = () => {
    if (location === CHAPTER_LIST) {
      return "Chapters"
    }
    else if (location === CHAPTER_VIEW) {
      return "TODO"
    }
    else if (location === VOCAB_QUIZ) {
      return "Quiz"
    }
    else if (location === NOUNS) {
      return "Noun Declensions"
    }
    else if (location === VERBS) {
      return "Verb endings"
    }
    else if (location === KEYBOARD) {
      return "Keyboard"
    }
    else {
      return ""
    }
  }

  const getComponent = () => {
    if (!content) {
      return <CircularProgress />
    }
    else if (location === LANDING) {
      return <Landing />
    }
    else if (location === CHAPTER_LIST) {
      return <ChapterList />
    }
    else if (location === CHAPTER_VIEW) {
      return <ChapterView />
    }
    else if (location === VOCAB_QUIZ) {
      return <VocabQuiz />
    }
    else if (location === NOUNS) {
      return <Nouns />
    }
    else if (location == CHART_DISPLAY) {
      return (
        <ChartDisplay study={false} />
      )
    }
    else if (location == CHART_QUIZ) {
      return (
        <ChartDisplay study={true} />
      )
    }
    else if (location == NOUN_QUIZ) {
      return <NounQuiz />
    }
    else if (location == VERBS) {
      return <Verbs />
    }
    else if (location === VERB_DISPLAY) {
      return <VerbDisplay study={false} />
    }
    else if (location === VERB_QUIZ) {
      return <VerbDisplay study={true} />      
    }
    else if (location === KEYBOARD) {
      return <Keyboard />
    }
  }
  return (
    <>
      <NavBar />
      {getComponent()}
    </>
  )
}



export default App;
