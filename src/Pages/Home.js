import { Button, Typography, Stack, Box, Card, CardContent } from '@mui/material'
import { Link } from 'react-router-dom'
import '../App.css'
import React from 'react'

function Home() {
  return (
    <div className='App'>
      <header className='App-header'>
        <Box
          sx={{
            textAlign: 'center',
            padding: '20px',

            borderRadius: '10px'
          }}
        >
          <Typography variant='h1' style={{ fontWeight: 'bold' }}>
            AEY
          </Typography>

          <Stack spacing={3} alignItems='center'>
            <Link to='/today' style={{ textDecoration: 'none', width: '100%' }}>
              <Button
                variant='contained'
                style={{ fontWeight: 'bold', width: '100%', borderRadius: '20px' }}
                size='large'
              >
                Electricity vs. Districtheating
              </Button>
            </Link>
            <Link to='/simulation' style={{ textDecoration: 'none', width: '100%' }}>
              <Button
                variant='contained'
                style={{ fontWeight: 'bold', width: '100%', borderRadius: '20px' }}
                size='large'
              >
                Simulation
              </Button>
            </Link>
            <Link to='/solarcell' style={{ textDecoration: 'none', width: '100%' }}>
              <Button
                variant='contained'
                style={{ fontWeight: 'bold', width: '100%', borderRadius: '20px' }}
                size='large'
              >
                Solarcell Simulation
              </Button>
            </Link>
          </Stack>
        </Box>
      </header>
    </div>
  )
}

export default Home
