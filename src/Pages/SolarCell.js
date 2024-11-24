import React, { useState } from 'react'
import { Typography, Stack, Button, CircularProgress, Box, FormHelperText, Grid } from '@mui/material'
import { LineChart, Line, YAxis, Legend, ResponsiveContainer } from 'recharts'
import BackButton from '../Components/BackButton'
import { getSolarData } from 'Api/solarCellData'
import { FaPlay } from 'react-icons/fa'

export default function SolarCell() {
  const [loading, setLoading] = useState(false)
  const [hour, setHour] = useState([])
  const [elforbruget, setElforbruget] = useState([])
  const [solarProduktion, setSolarProduktion] = useState([])
  const [overskudsproduktion3, setOverskudsproduktion3] = useState([])
  const [overskudsproduktion5, setOverskudsproduktion5] = useState([])
  const [totalBesparelse3, setTotalBesparelse3] = useState(0)
  const [totalBesparelse5, setTotalBesparelse5] = useState(0)
  const [salgspris, setSalgspris] = useState(0)
  const [Fjernevarmepris, setFjernevarmepris] = useState(0)

  const handleStartSimulation = () => {
    try {
      setLoading(true)
      const data = getSolarData()
      console.log('Solar Data:', data)
      setHour(data.hour)
      setElforbruget(data.elforbruget)
      setSolarProduktion(data.solarProduktion)
      setOverskudsproduktion3(data.overskudsproduktion_3)
      setOverskudsproduktion5(data.overskudsproduktion_5)
      setTotalBesparelse3(data.totalBesparelse3)
      setTotalBesparelse5(data.totalBesparelse5)
      setSalgspris(data.salgspris)
      setFjernevarmepris(data.Fjernevarmepris)
    } catch (error) {
      console.error('An error occurred while starting the simulation', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = hour.map((h, index) => ({
    hour: h,
    elforbruget: elforbruget[index],
    solarProduktion: solarProduktion[index],
    overskudsproduktion3: overskudsproduktion3[index],
    overskudsproduktion5: overskudsproduktion5[index]
  }))

  console.log('Chart Data:', chartData)

  return (
    <div className='App'>
      <header className='App-header'>
        <BackButton />
        <Typography variant='h3' style={{ fontWeight: 'bold' }} gutterBottom>
          SOLAR CELL SIMULATION
        </Typography>
        <Stack spacing={2}>
          <Button
            variant='contained'
            style={{ fontWeight: 'bold' }}
            startIcon={<FaPlay size='17' />}
            onClick={handleStartSimulation}
          >
            START SIMULATION
          </Button>
        </Stack>

        <Box sx={{ marginTop: '20px' }}>
          {loading ? (
            <CircularProgress />
          ) : chartData.length === 0 ? (
            <FormHelperText>Please click "Start Simulation" to see the result.</FormHelperText>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  marginBottom: '20px'
                }}
              >
                <FormHelperText>
                  Sale Price for Electricity: <span style={{ fontWeight: 'bold' }}>{salgspris} kr</span>
                </FormHelperText>
                <FormHelperText>
                  District Heating Price: <span style={{ fontWeight: 'bold' }}>{Fjernevarmepris} kr</span>
                </FormHelperText>
              </div>
              <Typography variant='h6'>
                Total Savings with 3kW:{' '}
                <span style={{ fontWeight: 'bold', color: '#46AD8D' }}>{totalBesparelse3.toFixed(2)} kr</span>
              </Typography>
              <Typography variant='h6'>
                Total Savings with 5kW:{' '}
                <span style={{ fontWeight: 'bold', color: '#ffc658' }}>{totalBesparelse5.toFixed(2)} kr</span>
              </Typography>
              <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ width: '100%', height: '400px' }}>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={chartData}>
                        <YAxis tick={{ fontSize: 14, fill: '#ccc' }} tickFormatter={(value) => `${value} kW`} />
                        <Legend />
                        <Line
                          type='monotone'
                          dataKey='solarProduktion'
                          stroke='#9d82ca'
                          name='Solar Production'
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ width: '100%', height: '400px' }}>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={chartData}>
                        <YAxis tick={{ fontSize: 14, fill: '#ccc' }} tickFormatter={(value) => `${value} kW`} />
                        <Legend />
                        <Line
                          type='monotone'
                          dataKey='elforbruget'
                          stroke='#82a9ca'
                          name='Power Consumption'
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ width: '100%', height: '400px' }}>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={chartData}>
                        <YAxis tick={{ fontSize: 14, fill: '#ccc' }} tickFormatter={(value) => `${value} kW`} />
                        <Legend />
                        <Line
                          type='monotone'
                          dataKey='overskudsproduktion3'
                          stroke='#82ca9d'
                          name='Excess Production (3kW)'
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ width: '100%', height: '400px' }}>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={chartData}>
                        <YAxis tick={{ fontSize: 14, fill: '#ccc' }} tickFormatter={(value) => `${value} kW`} />
                        <Legend />
                        <Line
                          type='monotone'
                          dataKey='overskudsproduktion5'
                          stroke='#ffc658'
                          name='Excess Production (5kW)'
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </header>
    </div>
  )
}
