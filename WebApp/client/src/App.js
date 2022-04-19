import './App.css';
import Header from './components/Header'
import LiveFeed from './components/LiveFeed'
import Charts from './components/Charts'
import {Chart} from './components/Chart'


function App() {
  return (
    <div className="App">
      <Header/>
      <main>
        <p>
        <img alt='gif'></img>

        </p>

        <LiveFeed rows="-7"/>

        <Charts/>
        <Chart/>

        




      </main>
      

      
    </div>
  );
}

export default App;
