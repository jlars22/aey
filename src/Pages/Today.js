import { Typography, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Box } from '@mui/material'
import '../App.css'
import React, { useEffect, useState } from 'react'
import BackButton from '../Components/BackButton'
import { CalendarIcon } from '@mui/x-date-pickers'
import { HEAT_PRICE_KWH } from '../Constants'
import { getPricesByDate } from 'Api/Elprisenligenu'

function Today() {
  const [electricityPrices, setElectricityPrices] = useState([])
  const [currentPrice, setCurrentPrice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchElectricityPrices() {
      const today = new Date()

      const data = await getPricesByDate(today)

      setElectricityPrices(data)

      const now = new Date()
      const currentHourPrice = data.find((price) => {
        const start = new Date(price.time_start)
        const end = new Date(price.time_end)
        return now >= start && now < end
      })
      setCurrentPrice(currentHourPrice)

      setLoading(false)
    }
    fetchElectricityPrices()
  }, [])

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Copenhagen'
  }
  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Copenhagen'
  }

  return (
    <div className='App'>
      <header className='App-header'>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <BackButton />
            <Typography variant='h3' style={{ fontWeight: 'bold' }}>
              ELECTRICITY PRICE VS. DISTRICT HEATING PRICE
            </Typography>

            <Typography variant='h6'>
              <Box display='flex' alignItems='center'>
                <CalendarIcon style={{ marginRight: '8px' }} />
                {new Date().toLocaleDateString('da-DK', dateOptions)}
              </Box>
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time Interval</TableCell>
                  <TableCell>Electricity Price (kr/kWh)</TableCell>
                  <TableCell>District Heating Price (kr/kWh)</TableCell>
                  <TableCell>Cheapest</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {electricityPrices.map((price, index) => {
                  const isElectricityCheaper = price.DKK_per_kWh < HEAT_PRICE_KWH
                  const isCurrentInterval =
                    price.time_start === currentPrice.time_start && price.time_end === currentPrice.time_end

                  console.log(isCurrentInterval)

                  return (
                    <TableRow
                      key={index}
                      sx={{
                        ...(isCurrentInterval && {
                          backgroundColor: '#35856b'
                        })
                      }}
                    >
                      <TableCell>
                        {new Date(price.time_start).toLocaleTimeString('da-DK', timeOptions)} -{' '}
                        {new Date(price.time_end).toLocaleTimeString('da-DK', timeOptions)}
                      </TableCell>
                      <TableCell>{price.DKK_per_kWh.toFixed(2)} kr</TableCell>
                      <TableCell>{HEAT_PRICE_KWH.toFixed(2)} kr</TableCell>
                      <TableCell>
                        {isElectricityCheaper ? (
                          <span style={{ color: 'green' }}>Electricity</span>
                        ) : (
                          <span style={{ color: 'red' }}>District Heating</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </>
        )}
      </header>
    </div>
  )
}

export default Today
