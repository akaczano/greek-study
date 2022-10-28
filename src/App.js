import { useEffect, useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const LANDING = 0
const CHAPTER_LIST = 1;
const CHAPTER_VIEW = 2;
const VOCAB_QUIZ = 3;
const NOUNS = 4;
const CHART_DISPLAY = 5;
const CHART_QUIZ = 6;
const NOUN_QUIZ = 7;
const VERBS = 8;
const VERB_DISPLAY = 9;
const VERB_QUIZ = 10;
const KEYBOARD = 11;

function App() {

  const [location, setLocation] = useState(LANDING)
  const [chapterName, setChapterName] = useState(null)
  const [chartName, setChartName] = useState(null)
  const [settings, setSettings] = useState({})


  let data = null
  let readonly = false
  if (window.electronAPI) {
    data = window.electronAPI.loadVocab()
  }
  else {
    data = { chapters: [], declensions: [], verbs: [] }
    fetch("https://raw.githubusercontent.com/akaczano/greek-study/master/vocab.json")
      .then((resp) => resp.json())
      .then(({ chapters, declensions, verbs }) => {
        setVocab(chapters)
        setCharts(declensions)
        setVerbCharts(verbs)
      })
    readonly = true
  }



  const { chapters, declensions, verbs } = data

  const [vocab, setVocab] = useState(chapters)
  const [charts, setCharts] = useState(declensions)
  const [verbCharts, setVerbCharts] = useState(verbs)

  useEffect(() => {
    if (!readonly) {
      window.electronAPI.saveVocab({ chapters: vocab, declensions: charts, verbs: verbCharts })
    }
  }, [vocab, charts, verbCharts])

  const onEdit = chapterName => {
    setLocation(CHAPTER_VIEW)
    setChapterName(chapterName)
  }

  const addTerm = (chapterName, term) => {
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

  const onStudy = chapterName => {
    setLocation(VOCAB_QUIZ)
    setChapterName(chapterName)
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

  const addChapter = chapterName => {
    const newVocab = [...vocab, { description: chapterName, attempts: 0, last_studied: null, words: [] }]
    setVocab(newVocab)
  }

  const deleteChapter = chapterName => {
    const otherChapters = vocab.filter(c => c.description != chapterName)
    setVocab(otherChapters)
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
  }

  const getComponentTitle = () => {
    if (location === CHAPTER_LIST) {
      return "Chapters"
    }
    else if (location === CHAPTER_VIEW) {
      return vocab.filter(v => v.description == chapterName)[0].description
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
    if (location === CHAPTER_LIST) {
      return <ChapterList vocab={vocab} onEdit={onEdit} onStudy={onStudy} onAdd={addChapter} onDelete={deleteChapter} readonly={readonly} />
    }
    else if (location === CHAPTER_VIEW) {
      return <ChapterView chapter={vocab.filter(v => v.description == chapterName)[0]} addTerm={addTerm} goBack={goBack} deleteTerm={deleteTerm} readonly={readonly} />
    }
    else if (location === VOCAB_QUIZ) {
      return <VocabQuiz chapter={vocab.filter(v => v.description == chapterName)[0]} goBack={goBack} onComplete={studyComplete} />
    }
    else if (location === NOUNS) {
      return (<Nouns
        charts={charts}
        onSelect={d => { setLocation(CHART_DISPLAY); setChartName(d) }}
        onAdd={updateChart}
        delete={deleteChart}
        onStudy={d => { setLocation(CHART_QUIZ); setChartName(d) }}
        onQuiz={s => { setLocation(NOUN_QUIZ); setSettings(s) }}
        readonly={readonly} />)
    }
    else if (location == CHART_DISPLAY) {
      return (
        <ChartDisplay
          chart={charts.filter(c => c.description == chartName)[0]}
          onUpdate={updateChart}
          back={() => setLocation(NOUNS)}
          study={false}
          readonly={readonly} />
      )
    }
    else if (location == CHART_QUIZ) {
      return (
        <ChartDisplay
          chart={charts.filter(c => c.description == chartName)[0]}
          back={() => setLocation(NOUNS)}
          study={true} />
      )
    }
    else if (location == NOUN_QUIZ) {
      return (
        <NounQuiz
          charts={charts}
          vocab={vocab}
          settings={settings}
          back={() => setLocation(NOUNS)}
          readonly={readonly} />
      )
    }
    else if (location === VERBS) {
      return (
        <Verbs
          charts={verbCharts}
          onSelect={d => { setLocation(VERB_DISPLAY); setChartName(d) }}
          onAdd={updateVerbChart}
          delete={deleteVerbChart}
          onStudy={d => { setLocation(VERB_QUIZ); setChartName(d) }}
          readonly={readonly}
        />
      )
    }
    else if (location === VERB_DISPLAY) {
      return (
        <VerbDisplay
          chart={verbCharts.filter(c => c.description == chartName)[0]}
          back={() => setLocation(VERBS)}
          study={false}
          onUpdate={updateVerbChart}
          readonly={readonly} />)
    }
    else if (location === VERB_QUIZ) {
      return (
        <VerbDisplay
          chart={verbCharts.filter(c => c.description == chartName)[0]}
          back={() => setLocation(VERBS)}
          study={true} />
      )
    }
    else if (location === KEYBOARD) {
      return <Keyboard />
    }
  }

  if (location === LANDING) {
    return (<Landing onVocab={() => setLocation(CHAPTER_LIST)} onNouns={() => setLocation(NOUNS)} onVerbs={() => setLocation(VERBS)} />)
  }
  else {
    return (
      <div style={{ width: '100%' }}>
        <Container>
          <Row style={{marginTop: '8px'}}>
            <Col md={8}>
              <h3>{getComponentTitle()}</h3>
            </Col>
            <Col>
              <Button tabIndex={-1} variant="link" onClick={() => setLocation(LANDING)}>Home</Button>
              <Button tabIndex={-1}  variant="link" onClick={() => setLocation(KEYBOARD)}>Keyboard</Button></Col>
          </Row>
          <Row>
            {getComponent()}
          </Row>
        </Container>
      </div>
    )
  }

}



export default App;
