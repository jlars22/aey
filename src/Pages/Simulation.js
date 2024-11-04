import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Button, Typography } from '@mui/material';
import BackButton from '../Components/BackButton';
import { IoMdPlay } from 'react-icons/io';
import { getPricesByDate } from '../Api/Elprisenligenu';

export default function Simulation() {
  const [currentDate, setCurrentDate] = useState(dayjs('2023-01-01'));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setCurrentDate((prevDate) => {
          const nextDate = prevDate.add(1, 'day');
          if (nextDate.year() > 2023) {
            clearInterval(timer);
            setIsRunning(false);
            return prevDate;
          }
          return nextDate;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const startSimulation = () => {
    setCurrentDate(dayjs('2023-01-01'));
    setIsRunning(true);
  };

  useEffect(() => {
    async function fetchElectricityPrices() {
      const date = currentDate.toDate();

      const data = await getPricesByDate(date);

      console.log(data);
    }
    fetchElectricityPrices();
  }, [currentDate]);

  return (
    <div className="App">
      <header className="App-header">
        <BackButton />
        <Typography variant="h3" style={{ fontWeight: 'bold' }}>
          SIMULATION FOR 2023
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={currentDate} readOnly views={['day']} />
        </LocalizationProvider>

        <Button
          variant="contained"
          onClick={startSimulation}
          disabled={isRunning}
          startIcon={<IoMdPlay />}
        >
          Start Simulation
        </Button>
      </header>
    </div>
  );
}
