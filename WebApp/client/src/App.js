import './App.css';
import Header from './components/Header'
import LiveFeed from './components/LiveFeed'
import Charts from './components/Charts'
import {Chart} from './components/Chart'
import  placeholder from './images/screenshotplaceholder.PNG'


function App() {
  return (
    <div className="App">
      <Header/>
      <main>
        <div className='Live'>
          <div className='LiveVideo'>
            <img  className='placeholder' src={placeholder} alt = "Placeholder" ></img>
          </div>

          <LiveFeed rows="-10"/>

        </div>
        
        <Charts/>


      </main>
      

      
    </div>
  );
}

export default App;
