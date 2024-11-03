import {
  ArrowLeftIcon,
  DateCalendar,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

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

  return (
    <div className="App">
      <header className="App-header">
        <Link to="/" className="back-button-container">
          <Button variant="outlined" startIcon={<ArrowLeftIcon />}>
            Back to Home
          </Button>
        </Link>
        <h1>Simulation for 2023</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={currentDate} readOnly views={['day']} />
        </LocalizationProvider>

        <button onClick={startSimulation} disabled={isRunning}>
          Start Simulation
        </button>
      </header>
    </div>
  );
}
