import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import BackButton from '../Components/BackButton';
import { IoMdPlay } from 'react-icons/io';
import { getPricesByDate } from '../Api/Elprisenligenu';
import { HEAT_PRICE_KWH_2023 } from '../Constants';
import { FaStop } from 'react-icons/fa';
import { MdElectricBolt } from 'react-icons/md';
import { LiaIndustrySolid } from 'react-icons/lia';

export default function Simulation() {
  const [currentDate, setCurrentDate] = useState(dayjs('2023-01-01'));
  const [isRunning, setIsRunning] = useState(false);
  const [savings, setSavings] = useState(0);
  const [energyConsumption, setEnergyConsumption] = useState(4.53);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(async () => {
        setCurrentDate((prevDate) => {
          const nextDate = prevDate.add(1, 'day');
          if (nextDate.year() > 2023) {
            clearInterval(timer);
            setIsRunning(false);
            return prevDate;
          }
          return nextDate;
        });

        const date = currentDate.toDate();
        const data = await getPricesByDate(date);

        const totalSavings = data.reduce((acc, price) => {
          if (price.DKK_per_kWh < HEAT_PRICE_KWH_2023) {
            return (
              acc +
              (HEAT_PRICE_KWH_2023 - price.DKK_per_kWh) * energyConsumption
            );
          }
          return acc;
        }, 0);

        setSavings((prevSavings) => prevSavings + totalSavings);
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isRunning, currentDate, energyConsumption]);

  const startSimulation = () => {
    setCurrentDate(dayjs('2023-01-01'));
    setSavings(0);
    setIsRunning(true);
  };

  const stopSimulation = () => {
    setIsRunning(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <BackButton />

        <Typography variant="h3" style={{ fontWeight: 'bold' }} gutterBottom>
          SIMULATION FOR 2023
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Energiforbrug"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MdElectricBolt />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">kWh/h</InputAdornment>
                ),
              },
            }}
            value={energyConsumption}
            onChange={(event) => {
              setEnergyConsumption(event.target.value);
            }}
            helperText={
              <>
                Angiv dit forventede energiforbrug pr. time i kWh. <br />
                Standardværdien er 4.53 kWh/h svarende til en gennemsnitlig
                husstand.
              </>
            }
          />
          <TextField
            disabled
            label="Fjernevarmepris"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LiaIndustrySolid />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">kr/kWh</InputAdornment>
                ),
              },
            }}
            value={HEAT_PRICE_KWH_2023}
            helperText={<>Gennemsnitlig fjernvarmepris for 2023.</>}
          />
        </Stack>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={currentDate}
            readOnly
            views={['day']}
            sx={{ marginTop: '20px' }}
          />
        </LocalizationProvider>

        <Stack spacing={2}>
          <Button
            variant="contained"
            onClick={startSimulation}
            disabled={isRunning}
            startIcon={<IoMdPlay />}
          >
            Start Simulation
          </Button>

          <Button
            variant="contained"
            onClick={stopSimulation}
            disabled={!isRunning}
            startIcon={<FaStop />}
          >
            Stop Simulation
          </Button>
        </Stack>

        <Stack sx={{ marginTop: '20px' }}>
          <Typography variant="h5" component="h5">
            Savings Summary
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Total Savings (DKK)
                </TableCell>
                <TableCell>{savings.toFixed(2)} kr</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography
            variant="caption"
            gutterBottom
            sx={{ display: 'block', marginTop: '15px' }}
          >
            Priserne er inklusiv statsafgifter, men eksklusiv moms.
          </Typography>
        </Stack>
      </header>
    </div>
  );
}
