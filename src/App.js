import React, { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null) //imput
  const to = "hi"
  const from = "en"
  const [output, setOutput] = useState('');

  useEffect(() => {
    handleListen()
  }, [isListening])


  const translate = async () => {
    const params = new URLSearchParams();
    params.append('q', note);
    params.append('source', from);
    params.append('target', to);

    
    
    await axios.post('https://libretranslate.de/translate',params, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(res=>{
      console.log(res.data)
      setOutput(res.data.translatedText)
    })
  };


  const handleListen = () => {

    if (isListening) {
      try{
        mic.start()
        mic.onend = () => {
          console.log('continue..')
          mic.start()
        }
      }
      catch{
        console.log("error")
      }

    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }


  return (
    <div className='body'>
      <h1>Assignment</h1>
      <div className="container">
          <h2 className='box-heading'>Translation Box</h2>
          {isListening ? <span className='rec'>Click to stop!🛑</span> : <span className='rec'>Click to start recording.🪩</span>}
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <button onClick={e=>translate()}>
          Translate
          </button>
            <div className='TsH'><span>English</span><center><p>{note}</p></center></div>
            <div className='TsH'><span>Hindi</span><center><p>{output}</p></center></div>
          

      </div>
    </div>
  )
}

export default App