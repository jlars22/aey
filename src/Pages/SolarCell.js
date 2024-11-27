import React, { useState } from 'react'
import {
  Typography,
  Stack,
  Button,
  CircularProgress,
  Box,
  FormHelperText,
  TextField,
  Grid,
  InputAdornment
} from '@mui/material'
import { LineChart, Line, YAxis, Legend, ResponsiveContainer } from 'recharts'
import BackButton from '../Components/BackButton'
import { getSolarData } from 'Api/solarCellData'
import { FaPlay, FaRegBuilding } from 'react-icons/fa'
import { PiSolarPanelFill } from 'react-icons/pi'
import { TbBuildingFactory, TbSolarElectricity, TbSunElectricity } from 'react-icons/tb'

export default function SolarCell() {
  const [loading, setLoading] = useState(false)
  const [hour, setHour] = useState([])
  const [elforbruget, setElforbruget] = useState([])
  const [solarProduktion, setSolarProduktion] = useState([])
  const [overskudsproduktion3, setOverskudsproduktion3] = useState([])
  const [overskudsproduktion5, setOverskudsproduktion5] = useState([])
  const [totalBesparelse3, setTotalBesparelse3] = useState(0)
  const [totalBesparelse5, setTotalBesparelse5] = useState(0)
  const [solcelleAreal, setSolcelleAreal] = useState(50)
  const [boligAreal, setBoligAreal] = useState(200)
  const [salgspris, setSalgspris] = useState(0.29)
  const [Fjernevarmepris, setFjernevarmepris] = useState(0.68)

  const handleStartSimulation = () => {
    try {
      setLoading(true)
      const data = getSolarData(solcelleAreal, boligAreal, salgspris, Fjernevarmepris)
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

  return (
    <div className='App'>
      <header className='App-header'>
        <BackButton />
        <Typography variant='h3' style={{ fontWeight: 'bold' }} gutterBottom>
          SOLAR CELL SIMULATION
        </Typography>
        <Stack spacing={2}>
          <TextField
            label='Solar Cell Area'
            variant='outlined'
            value={solcelleAreal}
            onChange={(e) => setSolcelleAreal(e.target.value)}
            helperText='Enter the area of the solar cells in square meters.'
            placeholder='50'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <PiSolarPanelFill color='#46AD8D' size='20' />
                  </InputAdornment>
                ),

                endAdornment: <InputAdornment position='end'>m²</InputAdornment>
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleStartSimulation()
              }
            }}
          />
          <TextField
            label='Building Area'
            variant='outlined'
            value={boligAreal}
            onChange={(e) => setBoligAreal(e.target.value)}
            helperText='Enter the area of the building in square meters.'
            placeholder='200'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <FaRegBuilding color='#46AD8D' size='20' />
                  </InputAdornment>
                ),

                endAdornment: <InputAdornment position='end'>m²</InputAdornment>
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleStartSimulation()
              }
            }}
          />
          <TextField
            label='Sale Price'
            variant='outlined'
            value={salgspris}
            onChange={(e) => setSalgspris(e.target.value)}
            helperText='Enter the sale price for electricity in kroner per kilowatt-hour.'
            placeholder='0.29'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <TbSunElectricity color='#46AD8D' size='20' />
                  </InputAdornment>
                ),

                endAdornment: <InputAdornment position='end'>kr/kWh</InputAdornment>
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleStartSimulation()
              }
            }}
          />
          <TextField
            label='District Heating Price'
            variant='outlined'
            value={Fjernevarmepris}
            onChange={(e) => setFjernevarmepris(e.target.value)}
            helperText='Enter the price for district heating in kroner per kilowatt-hour.'
            placeholder='0.68'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <TbBuildingFactory color='#46AD8D' size='20' />
                  </InputAdornment>
                ),

                endAdornment: <InputAdornment position='end'>kr/kWh</InputAdornment>
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleStartSimulation()
              }
            }}
          />
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
                          isAnimationActive={false}
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
                          isAnimationActive={false}
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
                          name='Power for central heating system (3kW)'
                          dot={false}
                          isAnimationActive={false}
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
                          name='Power for central heating system (5kW)'
                          dot={false}
                          isAnimationActive={false}
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
