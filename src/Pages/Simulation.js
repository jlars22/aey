import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import {
  Button,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Box,
  Grid2,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@mui/material'
import BackButton from '../Components/BackButton'
import { IoMdPlay } from 'react-icons/io'
import { getPricesByDate } from '../Api/Elprisenligenu'
import { HEAT_PRICE_KWH_2023 } from '../Constants'
import { FaStop } from 'react-icons/fa'
import { MdAttachMoney, MdElectricBolt } from 'react-icons/md'
import { LiaIndustrySolid } from 'react-icons/lia'
import { IoEarth } from 'react-icons/io5'

export default function Simulation() {
  const [currentDate, setCurrentDate] = useState(dayjs('2023-01-01'))
  const [isRunning, setIsRunning] = useState(false)
  const [savings, setSavings] = useState(0)
  const [energyConsumption, setEnergyConsumption] = useState(4.53)
  const [co2Savings, setCo2Savings] = useState(0)

  useEffect(() => {
    let timer
    if (isRunning) {
      timer = setInterval(async () => {
        setCurrentDate((prevDate) => {
          const nextDate = prevDate.add(1, 'day')
          if (nextDate.year() > 2023) {
            clearInterval(timer)
            setIsRunning(false)
            return prevDate
          }
          return nextDate
        })

        const date = currentDate.toDate()
        const data = await getPricesByDate(date)

        const totalSavings = data.reduce((acc, price) => {
          if (price.DKK_per_kWh < HEAT_PRICE_KWH_2023) {
            console.log(price.DKK_per_kWh)
            return acc + (HEAT_PRICE_KWH_2023 - price.DKK_per_kWh) * energyConsumption
          }
          return acc
        }, 0)

        setSavings((prevSavings) => prevSavings + totalSavings)
      }, 500)
    }
    return () => clearInterval(timer)
  }, [isRunning, currentDate, energyConsumption])

  const startSimulation = () => {
    setCurrentDate(dayjs('2023-01-01'))
    setSavings(0)
    setIsRunning(true)
  }

  const stopSimulation = () => {
    setIsRunning(false)
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
            label='Energiforbrug til opvarmning'
            variant='outlined'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <MdElectricBolt />
                  </InputAdornment>
                ),

                endAdornment: <InputAdornment position='end'>kWh/h</InputAdornment>
              }
            }}
            value={energyConsumption}
            onChange={(e) => setEnergyConsumption(parseFloat(e.target.value))}
            helperText={
              <>
                Angiv det forventede energiforbrug pr. time i kWh, udelukkende til opvarmning af vand i vandbeholderen.{' '}
                <br />
                Standardværdien er 4.53 kWh/h, baseret på gennemsnitligt energiforbrug for en husstands vandvarmer.
              </>
            }
          />
          <TextField
            disabled
            label='Fjernevarmepris'
            variant='outlined'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <LiaIndustrySolid />
                  </InputAdornment>
                ),

                endAdornment: <InputAdornment position='end'>kr/kWh</InputAdornment>
              }
            }}
            value={HEAT_PRICE_KWH_2023}
            helperText={<>Gennemsnitlig fjernvarmepris for 2023.</>}
          />
        </Stack>

        <Box>
          <Grid2 container>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar value={currentDate} readOnly views={['day']} sx={{ marginTop: '20px' }} />
            </LocalizationProvider>

            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: '#46AD8D' }}>
                    <MdAttachMoney color='white' />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='DKK' secondary={`${savings.toFixed(2)} kr`} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: '#46AD8D' }}>
                    <IoEarth color='white' />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='CO2' secondary='TODO' />
              </ListItem>
            </List>
          </Grid2>

          <Stack spacing={2}>
            <Button variant='contained' onClick={startSimulation} disabled={isRunning} startIcon={<IoMdPlay />}>
              Start Simulation
            </Button>

            <Button variant='contained' onClick={stopSimulation} disabled={!isRunning} startIcon={<FaStop />}>
              Stop Simulation
            </Button>
          </Stack>
        </Box>

        <Typography variant='caption' gutterBottom sx={{ display: 'block', marginTop: '15px' }}>
          Priserne er inklusiv statsafgifter, men eksklusiv moms.
        </Typography>
      </header>
    </div>
  )
}
