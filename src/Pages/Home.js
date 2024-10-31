import '../App.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AEY</h1>
        <Link to="/today">
          <button
            className="navigation-button"
            style={{
              marginBottom: '30px',
            }}
          >
            Electricity prices vs District heating prices for today
          </button>
        </Link>
        <Link to="/simulation">
          <button className="navigation-button">Simulation for 2023</button>
        </Link>
      </header>
    </div>
  );
}

export default Home;
