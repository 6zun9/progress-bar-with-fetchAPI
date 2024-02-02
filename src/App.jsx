import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import throttle from 'lodash.throttle'


function App() {
  const [progress,setProgress] = useState(0);

const updateProgress = throttle((value) => {
  setProgress(value);
}, 100, { leading: true, trailing: true });


  async function handleOnClick() {
    const res = await fetch('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4');

    if(!res?.body) return;

    const contentLength = res.headers.get('Content-Length');
    const totalLength = typeof contentLength ==='string' && parseInt(contentLength);
    const reader = res.body.getReader();
    const chunks = [];
    let receivedLength = 0;
    while(true){
      const { done, value } = await reader.read();
      if(done) break;
      chunks.push(value);
      receivedLength = receivedLength + value.length;
      const step = Math.floor(receivedLength / totalLength * 100);
      console.log(step,'step');
      updateProgress(step);
    }

    const blob = new Blob(chunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'ForBiggerEscapes.mp4';

    function handleOnDownload() {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click',handleOnDownload);
      }, 150);
    }
 
    a.addEventListener('click',handleOnDownload,false)
    a.click()
  }
  const progressBarStyle = {
    width: `${progress}%`,
    height: '20px',
    backgroundColor: '#4CAF50',  // Green color for the progress bar
    borderRadius: '4px',
    transition: 'width 0.5s ease-in-out',  // Smooth transition animation
  };
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleOnClick}>
          download
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div style={progressBarStyle}></div>
      <p>{progress}%</p>
    </>
  )
}

export default App
