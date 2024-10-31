import '../App.css';
import { useEffect, useState } from 'react';

// https://sparenergi.dk/privat/energipriser-paa-sparenergi
const HEAT_PRICE_KWH = 0.84;
const ELECTRICIY_TAX_RATE = 0.761;

function Today() {
  const [electricityPrices, setElectricityPrices] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);

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
        <h1>Elpris vs. Fjernvarmepris</h1>

        <p style={{ marginBottom: '30px' }}>
          {new Date().toLocaleDateString('da-DK', dateOptions)}
        </p>

        {currentPrice && (
          <div className="current-price">
            <h2>Aktuel Timepris</h2>
            <p>
              Tidsinterval:{' '}
              {new Date(currentPrice.time_start).toLocaleTimeString(
                'da-DK',
                timeOptions
              )}{' '}
              -{' '}
              {new Date(currentPrice.time_end).toLocaleTimeString(
                'da-DK',
                timeOptions
              )}
            </p>
            <p>Elpris: {currentPrice.DKK_per_kWh.toFixed(2)} kr/kWh</p>
            <p>Fjernvarmepris: {HEAT_PRICE_KWH.toFixed(2)} kr/kWh</p>
            <p>
              Billigst:{' '}
              <span
                style={{
                  color:
                    currentPrice.DKK_per_kWh < HEAT_PRICE_KWH ? 'green' : 'red',
                }}
              >
                {currentPrice.DKK_per_kWh < HEAT_PRICE_KWH
                  ? 'Strøm'
                  : 'Fjernvarme'}
              </span>
            </p>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Tidsinterval</th>
              <th>Elpris (kr/kWh)</th>
              <th>Fjernvarmepris (kr/kWh)</th>
              <th>Billigst</th>
            </tr>
          </thead>
          <tbody>
            {electricityPrices.map((price, index) => {
              const isElectricityCheaper = price.DKK_per_kWh < HEAT_PRICE_KWH;
              const isCurrentInterval =
                currentPrice &&
                price.time_start === currentPrice.time_start &&
                price.time_end === currentPrice.time_end;

              return (
                <tr
                  key={index}
                  style={{
                    borderColor: isCurrentInterval ? '#c2a504' : '',
                    borderWidth: isCurrentInterval ? '2px' : '',
                    borderStyle: isCurrentInterval ? 'solid' : '',
                  }}
                >
                  <td>
                    {new Date(price.time_start).toLocaleTimeString(
                      'da-DK',
                      timeOptions
                    )}{' '}
                    -{' '}
                    {new Date(price.time_end).toLocaleTimeString(
                      'da-DK',
                      timeOptions
                    )}
                  </td>
                  <td>{price.DKK_per_kWh.toFixed(2)} kr</td>
                  <td>{HEAT_PRICE_KWH.toFixed(2)} kr</td>
                  <td>
                    {isElectricityCheaper ? (
                      <span style={{ color: 'green' }}>Strøm</span>
                    ) : (
                      <span style={{ color: 'red' }}>Fjernvarme</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="italic">
          Priserne er inklusiv statsafgifter, men eksklusiv moms.
        </p>
      </header>
    </div>
  );
}

export default Today;
