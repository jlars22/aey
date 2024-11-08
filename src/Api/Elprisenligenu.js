import { formatDate } from '../Util'

export async function getPricesByDate(date) {
  try {
    const { year, month, day } = formatDate(date)

    const response = await fetch(`https://www.elprisenligenu.dk/api/v1/prices/${year}/${month}-${day}_DK2.json`)
    const data = await response.json()

    const statsafgiftikwh = 761 / 1000
    const moms = 1.25
    const afgiftmedmoms = statsafgiftikwh * moms
    const tarif = 1139.5 / 1000

    data.forEach((price) => {
      price.DKK_per_kWh = price.DKK_per_kWh + tarif - afgiftmedmoms * 0.22
    })

    return data
  } catch (error) {
    console.error(error)
  }
}
