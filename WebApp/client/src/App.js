import './App.css';
import Header from './components/Header'
import LiveFeed from './components/LiveFeed'
import Charts from './components/Charts'
//import  placeholder from './images/screenshotplaceholder.PNG'


function App() {
  return (
    <div className="App">
      <Header/>
      <main>
        <div className='Live'>
          <div className='LiveVideo'>
            
            <div className="App-texter">
            <header><bold>Live data from traffic</bold></header>
            <p>Left side box shows traffic data in live. Video abowe shows realtime video.  </p>
            
            

            </div>
          </div>

          <LiveFeed rows="-10"/>

        </div>
        
        <Charts/>


      </main>
      

      
    </div>
  );
}

export default App;
