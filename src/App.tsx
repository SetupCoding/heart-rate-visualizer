import React, { useState } from 'react';
import './App.css';
import { useInterval } from './hooks/useInterval';
import { ReactComponent as HeartIcon } from './icons/heart.svg'
import { BPMToTimeData } from './models/BPMToTimeData.model';
import { Graph } from './components';


const MAX_INTERVAL_SAVED_DATA = 60 * 10
const App: React.FC = () => {
  const [error, setError] = useState<any>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [BPM, setBPM] = useState<BPMToTimeData[]>([]);

  const addBPM = (value: string) => {
    console.log(BPM)
    setBPM(prev =>
      prev.length > MAX_INTERVAL_SAVED_DATA ?
        [...prev, { value: value, time: Date.now() }].slice(1) :
        [...prev, { value: value, time: Date.now() }]
    );

  }
  useInterval(async () => {
    fetch("http://localhost:6547/hr")
      .then(res => res.json())
      .then(
        (result) => {
          setError(undefined);
          setIsLoaded(true);
          addBPM(result)
        },
        (error: any) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, 1000)



  return (error ? <div>Error: {error.message}</div> : !isLoaded ? <div>Loading...</div> : <div className="App">
    <header className="App-header">

      <Graph data={BPM} />
      <div className='App-text'>{BPM.slice(-1).pop()?.value}</div>
      <div className="App-heart-wrapper"><HeartIcon className='App-heart' />
      </div>

    </header>
  </div>
  );
}

export default App
