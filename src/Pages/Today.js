import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Box,
} from '@mui/material';

import '../App.css';
import { useEffect, useState } from 'react';
import BackButton from '../Components/BackButton';
import { CalendarIcon } from '@mui/x-date-pickers';

// https://sparenergi.dk/privat/energipriser-paa-sparenergi
const HEAT_PRICE_KWH = 0.84;
const ELECTRICIY_TAX_RATE = 0.761;

function Today() {
  const [electricityPrices, setElectricityPrices] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchElectricityPrices() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      try {
        const response = await fetch(
          `https://www.elprisenligenu.dk/api/v1/prices/${year}/${month}-${day}_DK2.json`
        );
        const data = await response.json();

        data.forEach((price) => {
          price.DKK_per_kWh = price.DKK_per_kWh + ELECTRICIY_TAX_RATE;
        });

        setElectricityPrices(data);

        const now = new Date();
        const currentHourPrice = data.find((price) => {
          const start = new Date(price.time_start);
          const end = new Date(price.time_end);
          return now >= start && now < end;
        });
        setCurrentPrice(currentHourPrice);
      } catch (error) {
        console.error('Fejl ved hentning af elpriser:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchElectricityPrices();
  }, []);

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Copenhagen',
  };
  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Copenhagen',
  };

  return (
    <div className="App">
      <header className="App-header">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <BackButton />
            <Typography variant="h3" style={{ fontWeight: 'bold' }}>
              ELPRIS VS. FJERNVARMEPRIS
            </Typography>

            <Typography variant="h6">
              <Box display="flex" alignItems="center">
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
                  const isElectricityCheaper =
                    price.DKK_per_kWh < HEAT_PRICE_KWH;
                  const isCurrentInterval =
                    currentPrice &&
                    price.time_start === currentPrice.time_start &&
                    price.time_end === currentPrice.time_end;

                  return (
                    <TableRow
                      key={index}
                      style={{
                        borderColor: isCurrentInterval ? '#46AD8D' : '',
                        borderWidth: isCurrentInterval ? '2px' : '',
                        borderStyle: isCurrentInterval ? 'solid' : '',
                      }}
                    >
                      <TableCell>
                        {new Date(price.time_start).toLocaleTimeString(
                          'da-DK',
                          timeOptions
                        )}{' '}
                        -{' '}
                        {new Date(price.time_end).toLocaleTimeString(
                          'da-DK',
                          timeOptions
                        )}
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
                  );
                })}
              </TableBody>
            </Table>
            <Typography
              variant="caption"
              gutterBottom
              sx={{ display: 'block', marginTop: '15px' }}
            >
              Priserne er inklusiv statsafgifter, men eksklusiv moms.
            </Typography>
          </>
        )}
      </header>
    </div>
  );
}

export default Today;
