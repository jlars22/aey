import '../App.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AEY</h1>
        <Link to="/today">
          <button
            style={{
              padding: '10px 20px',
              fontSize: '1.2em',
              marginBottom: '30px',
            }}
          >
            Electricity prices vs District heating prices for today
          </button>
        </Link>
        <Link to="/simulation">
          <button style={{ padding: '10px 20px', fontSize: '1.2em' }}>
            Simulation for 2023
          </button>
        </Link>
      </header>
    </div>
  );
}

export default Home;
