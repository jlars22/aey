import { Typography, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Box } from '@mui/material'
import '../App.css'
import React, { useEffect, useState } from 'react'
import BackButton from '../Components/BackButton'
import { CalendarIcon } from '@mui/x-date-pickers'
import { HEAT_PRICE_KWH } from '../Constants'
import { getPricesByDate } from 'Api/Elprisenligenu'
import { TbBuildingFactory } from 'react-icons/tb'
import { MdElectricBolt, MdPriceCheck } from 'react-icons/md'
import { IoMdTime } from 'react-icons/io'

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
                  <TableCell>
                    <IoMdTime size={24} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    Time Interval
                  </TableCell>
                  <TableCell>
                    <MdElectricBolt size={24} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    Electricity Price (kr/kWh)
                  </TableCell>
                  <TableCell>
                    <TbBuildingFactory size={24} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    District Heating Price (kr/kWh)
                  </TableCell>
                  <TableCell>
                    <MdPriceCheck size={24} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    Cheapest
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {electricityPrices.map((price, index) => {
                  const isElectricityCheaper = price.DKK_per_kWh < HEAT_PRICE_KWH
                  const isCurrentInterval =
                    currentPrice &&
                    price.time_start === currentPrice.time_start &&
                    price.time_end === currentPrice.time_end

                  const highlightColor = isCurrentInterval ? '#35856b' : 'inherit'

                  console.log('Current Price:', currentPrice)
                  console.log('Price:', price)
                  console.log('isCurrentInterval:', isCurrentInterval)

                  return (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          backgroundColor: highlightColor
                        }}
                      >
                        {new Date(price.time_start).toLocaleTimeString('da-DK', timeOptions)} -{' '}
                        {new Date(price.time_end).toLocaleTimeString('da-DK', timeOptions)}
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: highlightColor
                        }}
                      >
                        {price.DKK_per_kWh.toFixed(2)} kr
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: highlightColor
                        }}
                      >
                        {HEAT_PRICE_KWH.toFixed(2)} kr
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: highlightColor
                        }}
                      >
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