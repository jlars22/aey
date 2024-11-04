import { ELECTRICIY_TAX_RATE } from '../Constants';
import { formatDate } from '../Util';

export async function getPricesByDate(date) {
  try {
    const { year, month, day } = formatDate(date);

    const response = await fetch(
      `https://www.elprisenligenu.dk/api/v1/prices/${year}/${month}-${day}_DK2.json`
    );
    const data = await response.json();

    data.forEach((price) => {
      price.DKK_per_kWh = price.DKK_per_kWh + ELECTRICIY_TAX_RATE;
    });

    return data;
  } catch (error) {
    console.error(error);
  }
}
