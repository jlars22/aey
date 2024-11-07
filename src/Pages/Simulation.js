// @ts-nocheck
import React, { useState } from 'react'
import { Typography, Stack, TextField, InputAdornment, Box, Button, CircularProgress } from '@mui/material'
import BackButton from '../Components/BackButton'
import { HEAT_PRICE_KWH_2023 } from '../Constants'
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
  const [saving, setSaving] = useState(0)

  const [errors, setErrors] = useState({
    insideTemperature: false,
    districtHeatingPrice: false,
    tarif: false,
    statsafgift: false,
    moms: false
  })

  const validateNumber = (value) => {
    return !isNaN(value) && value !== '' && !value.includes(',')
  }

  const handleBlur = (field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: !validateNumber(value)
    }))
  }

  const handleStartSimulation = () => {
    try {
      setSaving(0)
      setLoading(true)
      if (Object.values(errors).some((error) => error)) {
        console.log('Please fix the errors before starting the simulation')
        return
      }

      calculateSaving()
    } catch (error) {
      console.error('An error occurred while starting the simulation', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateSaving = () => {}

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
            placeholder={17}
            style={{ width: '500px' }}
            value={insideTemperature}
            onChange={(e) => setInsideTemperature(e.target.value)}
            onBlur={() => handleBlur('insideTemperature', insideTemperature)}
            error={errors.insideTemperature}
            helperText={errors.insideTemperature ? 'Please enter a valid number without commas' : ''}
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
            placeholder={725}
            style={{ width: '500px' }}
            value={districtHeatingPrice}
            onChange={(e) => setDistrictHeatingPrice(e.target.value)}
            onBlur={() => handleBlur('districtHeatingPrice', districtHeatingPrice)}
            error={errors.districtHeatingPrice}
            helperText={errors.districtHeatingPrice ? 'Please enter a valid number without commas' : ''}
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
            onBlur={() => handleBlur('tarif', tarif)}
            error={errors.tarif}
            helperText={errors.tarif ? 'Please enter a valid number without commas' : ''}
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
            onBlur={() => handleBlur('statsafgift', statsafgift)}
            error={errors.statsafgift}
            helperText={errors.statsafgift ? 'Please enter a valid number without commas' : ''}
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
            onBlur={() => handleBlur('moms', moms)}
            error={errors.moms}
            helperText={errors.moms ? 'Please enter a valid number without commas' : ''}
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
          <Typography variant='h4' style={{ fontWeight: 'bold' }} gutterBottom>
            RESULTAT
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : saving > 0 ? (
            <Typography variant='h6' color='primary'>
              Du kan spare {saving.toFixed(2)} kr om året ved at bruge vores produkt.
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
