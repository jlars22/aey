export function getSolarData(solcelleAreal, boligAreal, salgspris, Fjernevarmepris) {
  const energi = require('./potentiale_el.json')
  const energi2 = require('./district_heating.json')
  const energi3 = require('./elforbrug_hotel.json')

  const hour = energi2.map((item) => item['Hour'])
  const radiation = energi2.map((item) => item['Hourly Global Solar Radiation (Wh/m2)'] / 1000)
  const airTemp = energi.map((item) => item['Delta T'])

  const nSolar = 0.2

  const solarProduktion = radiation.map((value) => value * nSolar * solcelleAreal)

  // solarProduktion bruges til at plotte power produktion ved hour på x og kw på y
  const yearlyProduction = solarProduktion.reduce((sum, value) => sum + value, 0)

  const consumption = energi3.map((item) => parseFloat(item['Consumption_MWh']))
  const elforbrugAlleHoteller = consumption.reduce((sum, value) => sum + value, 0)
  const elforbrugKunde = (51 * boligAreal) / 1000
  const faktor = elforbrugKunde / elforbrugAlleHoteller

  // elforbruget bruges til at plotte power consumption ved hour på x og kw på y
  const elforbruget = consumption.map((value) => value * faktor * 1000)

  // overskudsProduktion bruges til at plotte power overskud ved hour på x og kw på y
  const overskudsProduktion = solarProduktion.map((value, index) => {
    const overskud = value - elforbruget[index]
    return overskud < 0 ? 0 : overskud
  })

  const totalOverproduction = overskudsProduktion.reduce((sum, value) => sum + value, 0)

  const besparelse = totalOverproduction * (Fjernevarmepris - salgspris)

  const overskudsproduktion_3 = overskudsProduktion.map((value) => Math.min(value, 3))
  const overskudsproduktion_5 = overskudsProduktion.map((value) => Math.min(value, 5))

  const totalBesparelse3 = overskudsproduktion_3.reduce((sum, value) => sum + value, 0) * (Fjernevarmepris - salgspris)
  const totalBesparelse5 = overskudsproduktion_5.reduce((sum, value) => sum + value, 0) * (Fjernevarmepris - salgspris)

  return {
    hour,
    solarProduktion,
    elforbruget,
    overskudsproduktion_3,
    overskudsproduktion_5,
    totalBesparelse3,
    totalBesparelse5,
    salgspris,
    Fjernevarmepris
  }
}
