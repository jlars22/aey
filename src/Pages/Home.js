import { Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import '../App.css'

function Home() {
  return (
    <div className='App'>
      <header className='App-header'>
        <Typography variant='h1' gutterBottom style={{ fontWeight: 'bold' }}>
          AEY
        </Typography>
        <Link to='/today'>
          <Button variant='contained' style={{ marginBottom: '30px', fontWeight: 'bold' }} size='large'>
            Electricity vs. Districtheating
          </Button>
        </Link>
        <Link to='/simulation'>
          <Button variant='contained' style={{ fontWeight: 'bold' }} size='large'>
            Simulation
          </Button>
        </Link>
      </header>
    </div>
  )
}

export default Home
