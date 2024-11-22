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
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import BackButton from '../Components/BackButton'
import { MdElectricBolt } from 'react-icons/md'
import { getData } from 'Api/data'
import { CiTempHigh } from 'react-icons/ci'
import { FaPlay } from 'react-icons/fa'
import { GiHeatHaze } from 'react-icons/gi'

export default function Simulation() {
  const [districtHeatingPrice, setDistrictHeatingPrice] = useState(725)
  const [insideTemperature, setInsideTemperature] = useState(17)
  const [elafgift, setElafgift] = useState(1139.5)
  const [loading, setLoading] = useState(false)
  const [savingThreeKw, setSavingThreeKw] = useState(-1)
  const [savingFiveKw, setSavingFiveKw] = useState(-1)
  const [electricityReduction, setElectricityReduction] = useState(true)

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

  const toggleReduction = () => {
    setElectricityReduction(!electricityReduction)
  }

  const calculateSaving = () => {
    let totalSavingThreeKWControlled = 0
    let totalSavingFiveKWControlled = 0

    const parsedInsideTemperature = parseFloat(insideTemperature)
    const parsedDistrictHeatingPrice = parseFloat(districtHeatingPrice)
    const parsedTariff = parseFloat(elafgift)

    console.log(parsedInsideTemperature, parsedDistrictHeatingPrice, parsedTariff)

    // Iterate over each data entry and perform the calculations
    getData().forEach((entry) => {
      // Step 1: Calculate deltaT
      const deltaT = parsedInsideTemperature - entry.outside_temp

      // Step 2: Calculate heat loss
      const heatloss = entry.outside_temp > parsedInsideTemperature ? 0 : (7.5 / 32) * deltaT

      // Step 3: Calculate added effect for 3 kW and 5.2 kW
      const threeKwEffect = Math.min(heatloss, 3)
      const fiveKwEffect = Math.min(heatloss, 5.2)

      // Step 4: Calculate electricity price with adjustments
      let adjustedElectricityPrice = parseFloat(entry.electricity_price) + parsedTariff

      if (electricityReduction) {
        adjustedElectricityPrice = adjustedElectricityPrice - 761 * 1.25 * 0.22
      }

      // Step 5: Calculate savings
      const savingThreeKWAlwaysOn = ((parsedDistrictHeatingPrice - adjustedElectricityPrice) * threeKwEffect) / 1000
      const savingFiveKWAlwaysOn = ((parsedDistrictHeatingPrice - adjustedElectricityPrice) * fiveKwEffect) / 1000

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
          SIMULATION
        </Typography>
        <Stack spacing={2}>
          <TextField
            label='Indoor temperature'
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
            value={insideTemperature}
            onChange={(e) => setInsideTemperature(e.target.value)}
            helperText='Enter the desired indoor temperature in degrees Celsius.'
          />

          <TextField
            label='District heating price'
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
            value={districtHeatingPrice}
            onChange={(e) => setDistrictHeatingPrice(e.target.value)}
            helperText='Enter the price for district heating in kroner per megawatt-hour.'
          />

          <TextField
            label='Electricity tariff'
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
            value={elafgift}
            onChange={(e) => setElafgift(e.target.value)}
            helperText='Enter the combined tax and tariff for electricity in kroner per megawatt-hour.'
          />

          <div style={{ marginLeft: '15px' }}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked onClick={() => toggleReduction()} />}
                label='Is this calculation for a business?'
              />
              <FormHelperText sx={{ marginLeft: '31.5px', marginTop: '-10px' }}>
                This will provide a reduction in the electricity price.
              </FormHelperText>
            </FormGroup>
          </div>

          <Button
            variant='contained'
            style={{ fontWeight: 'bold' }}
            startIcon={<FaPlay size='17' />}
            onClick={handleStartSimulation}
          >
            START SIMULATION
          </Button>

          <FormHelperText>
            All example values and the electricity spot prices used, as well as outdoor temperatures, are examples from
            Denmark in 2023.
          </FormHelperText>
        </Stack>

        <Box sx={{ marginTop: '20px' }}>
          <Typography variant='h4' style={{ fontWeight: 'bold' }} gutterBottom>
            RESULT
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : savingThreeKw === -1 ? (
            <FormHelperText>Please enter the values and click "Start Simulation" to see the result.</FormHelperText>
          ) : savingThreeKw > 0 ? (
            <Typography variant='h6' color=''>
              By using a 3 kW electric heating element, you can save{' '}
              <span style={{ fontWeight: 'bold', color: '#46AD8D' }}>{savingThreeKw.toFixed(2)} kr</span> per year by
              using our product.
              <br />
              By using a 5.2 kW electric heating element, you can save{' '}
              <span style={{ fontWeight: 'bold', color: '#46AD8D' }}>{savingFiveKw.toFixed(2)} kr</span> per year by
              using our product.
            </Typography>
          ) : (
            <>
              <Typography variant='h6' color='red'>
                Unfortunately, you cannot save money by using our product.
              </Typography>
            </>
          )}
        </Box>
      </header>
    </div>
  )
}
