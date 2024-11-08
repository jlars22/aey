import { Typography, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Box } from '@mui/material'
import '../App.css'
import { useEffect, useState } from 'react'
import BackButton from '../Components/BackButton'
import { CalendarIcon } from '@mui/x-date-pickers'
import { HEAT_PRICE_KWH } from '../Constants'
import { getPricesByDate } from '../Api/Elprisenligenu'

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
              ELPRIS VS. FJERNVARMEPRIS
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
                  <TableCell>Tidsinterval</TableCell>
                  <TableCell>Elpris (kr/kWh)</TableCell>
                  <TableCell>Fjernvarmepris (kr/kWh)</TableCell>
                  <TableCell>Billigst</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {electricityPrices.map((price, index) => {
                  const isElectricityCheaper = price.DKK_per_kWh < HEAT_PRICE_KWH
                  const isCurrentInterval =
                    currentPrice &&
                    price.time_start === currentPrice.time_start &&
                    price.time_end === currentPrice.time_end

                  return (
                    <TableRow
                      key={index}
                      style={{
                        borderColor: isCurrentInterval ? '#46AD8D' : '',
                        borderWidth: isCurrentInterval ? '2px' : '',
                        borderStyle: isCurrentInterval ? 'solid' : ''
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
                          <span style={{ color: 'green' }}>Strøm</span>
                        ) : (
                          <span style={{ color: 'red' }}>Fjernvarme</span>
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
