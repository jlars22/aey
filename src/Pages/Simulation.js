// @ts-nocheck
import React, { useState } from 'react'
import {
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Box,
  Button,
  CircularProgress,
  FormHelperText
} from '@mui/material'
import BackButton from '../Components/BackButton'
import { MdElectricBolt } from 'react-icons/md'
import { getData } from 'Api/data'
import { CiTempHigh } from 'react-icons/ci'
import { FaPlay } from 'react-icons/fa'
import { GiHeatHaze } from 'react-icons/gi'
import { RiGovernmentFill } from 'react-icons/ri'

export default function Simulation() {
  const [districtHeatingPrice, setDistrictHeatingPrice] = useState(725)
  const [insideTemperature, setInsideTemperature] = useState(17)
  const [tarif, setTarif] = useState(1139.5)
  const [statsafgift, setStatsafgift] = useState(761)
  const [moms, setMoms] = useState(25)
  const [loading, setLoading] = useState(false)
  const [savingThreeKw, setSavingThreeKw] = useState(-1)
  const [savingFiveKw, setSavingFiveKw] = useState(-1)

  const handleStartSimulation = () => {
    try {
      setSavingThreeKw(-1)
      setSavingFiveKw(-1)
      setLoading(true)

      calculateSaving()
    } catch (error) {
      console.error('An error occurred while starting the simulation', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateSaving = () => {
    let totalSavingThreeKWControlled = 0
    let totalSavingFiveKWControlled = 0

    console.log(insideTemperature, districtHeatingPrice, tarif, statsafgift, moms)

    // Iterate over each data entry and perform the calculations
    getData().forEach((entry) => {
      // Step 1: Calculate deltaT
      const deltaT = insideTemperature - entry.outside_temp

      // Step 2: Calculate heat loss
      const heatloss = entry.outside_temp > insideTemperature ? 0 : (7.5 / 32) * deltaT

      // Step 3: Calculate added effect for 3 kW and 5.2 kW
      const threeKwEffect = Math.min(heatloss, 3)
      const fiveKwEffect = Math.min(heatloss, 5.2)

      // Step 4: Calculate electricity price with adjustments
      const statsafgiftMedMoms = statsafgift * (moms / 100 + 1)
      const adjustedElectricityPrice = parseFloat(entry.electricity_price) + tarif - statsafgiftMedMoms * 0.22

      // Step 5: Calculate savings
      const savingThreeKWAlwaysOn = ((districtHeatingPrice - adjustedElectricityPrice) * threeKwEffect) / 1000
      const savingFiveKWAlwaysOn = ((districtHeatingPrice - adjustedElectricityPrice) * fiveKwEffect) / 1000

      // Step 6: Calculate controlled savings
      const savingThreeKWControlled = savingThreeKWAlwaysOn > 0 ? savingThreeKWAlwaysOn : 0
      const savingFiveKWControlled = savingFiveKWAlwaysOn > 0 ? savingFiveKWAlwaysOn : 0

      // Accumulate controlled savings for the final output
      totalSavingThreeKWControlled += savingThreeKWControlled
      totalSavingFiveKWControlled += savingFiveKWControlled
    })

    // Set the calculated total savings for controlled modes
    setSavingThreeKw(totalSavingThreeKWControlled)
    setSavingFiveKw(totalSavingFiveKWControlled)
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <BackButton />

        <Typography variant='h3' style={{ fontWeight: 'bold' }} gutterBottom>
          SIMULATION FOR 2023
        </Typography>
        <Stack spacing={2}>
          <TextField
            label='Inde temperatur'
            variant='outlined'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <CiTempHigh color='#46AD8D' size='20' />
                  </InputAdornment>
                ),

                endAdornment: <InputAdornment position='end'>°C</InputAdornment>
              }
            }}
            placeholder={'17'}
            style={{ width: '500px' }}
            value={insideTemperature}
            onChange={(e) => setInsideTemperature(e.target.value)}
          />

          <TextField
            label='Fjernevarmepris'
            variant='outlined'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <GiHeatHaze color='#46AD8D' size='20' />
                  </InputAdornment>
                ),

                endAdornment: <InputAdornment position='end'>Kr/MWh</InputAdornment>
              }
            }}
            placeholder={'725'}
            style={{ width: '500px' }}
            value={districtHeatingPrice}
            onChange={(e) => setDistrictHeatingPrice(e.target.value)}
          />

          <TextField
            label='Tarif'
            variant='outlined'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <MdElectricBolt color='#46AD8D' size='20' />
                  </InputAdornment>
                ),

                endAdornment: <InputAdornment position='end'>Kr/MWh</InputAdornment>
              }
            }}
            placeholder={'1139.5'}
            style={{ width: '500px' }}
            value={tarif}
            onChange={(e) => setTarif(e.target.value)}
          />

          <TextField
            label='Statsafgift'
            variant='outlined'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <RiGovernmentFill color='#46AD8D' size='20' />
                  </InputAdornment>
                ),

                endAdornment: <InputAdornment position='end'>Kr/MWh</InputAdornment>
              }
            }}
            placeholder={'761'}
            style={{ width: '500px' }}
            value={statsafgift}
            onChange={(e) => setStatsafgift(e.target.value)}
          />

          <TextField
            label='Moms'
            variant='outlined'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <RiGovernmentFill color='#46AD8D' size='20' />
                  </InputAdornment>
                ),

                endAdornment: <InputAdornment position='end'>%</InputAdornment>
              }
            }}
            placeholder={'25'}
            style={{ width: '500px' }}
            value={moms}
            onChange={(e) => setMoms(e.target.value)}
          />

          <FormHelperText>Alle værdierne er eksempler for 2023 i Danmark.</FormHelperText>

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
          <Typography variant='h4' style={{ fontWeight: 'bold' }} gutterBottom>
            RESULTAT
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : savingThreeKw === -1 ? (
            <Typography variant='caption'>
              Indtast venligst værdierne og tryk på "Start Simulation" for at se resultatet.
            </Typography>
          ) : savingThreeKw > 0 ? (
            <Typography variant='h6' color='primary'>
              Ved brug af en el-patron på 3 kW kan du spare {savingThreeKw.toFixed(2)} kr om året ved at bruge vores
              produkt.
              <br />
              Ved brug af en el-patron på 5.2 kW kan du spare {savingFiveKw.toFixed(2)} kr om året ved at bruge vores
              produkt.
            </Typography>
          ) : (
            <Typography variant='h6' color='red'>
              Du kan ikke desværre ikke spare penge ved at bruge vores produkt.
            </Typography>
          )}
        </Box>
      </header>
    </div>
  )
}
