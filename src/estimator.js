let period = 0;

const infectionsByRequestedTime = (data) => {
  if (data.periodType === 'days') period = data.timeToElapse;
  else if (data.periodType === 'weeks') period = data.timeToElapse * 7;
  else if (data.periodType === 'months') period = data.timeToElapse * 30;

  return this.currentlyInfected * (2 ** Number(period / 3));
}

const dollarsInFlight = (data) => {
  let dollarsInFlights = infectionsByRequestedTime(data) * data.region.avgDailyIncomePopulation;
      dollarsInFlights *= data.region.avgDailyIncomeInUSD;
      dollarsInFlights = Number(dollarsInFlight / period);

  return dollarsInFlights;
}

const covid19ImpactEstimator = (data) => ({
  data: data,
  estimate: {
    impact:{
      currentlyInfected: data.reportedCases * 10,
      infectionsByRequestedTime: infectionsByRequestedTime(data),
      severeCasesByRequestedTime: Number(infectionsByRequestedTime(data) * 0.15),
      hospitalBedsByRequestedTime: (data.totalHospitalBeds * 0.35) - this.severeCasesByRequestedTime,
      casesForICUByRequestedTime: Number(infectionsByRequestedTime(data) * 0.05),
      casesForVentilatorsByRequestedTime: Number(infectionsByRequestedTime(data) * 0.02),
      dollarsInFlight: dollarsInFlight(data)
    },
    severeImpact: {
      currentlyInfected: data.reportedCases * 50,
      infectionsByRequestedTime: infectionsByRequestedTime(data),
      severeCasesByRequestedTime: Number(infectionsByRequestedTime(data) * 0.15),
      hospitalBedsByRequestedTime: (data.totalHospitalBeds * 0.35) - this.severeCasesByRequestedTime,
      casesForICUByRequestedTime: Number(infectionsByRequestedTime(data) * 0.05),
      casesForVentilatorsByRequestedTime: Number(infectionsByRequestedTime(data) * 0.02),
      dollarsInFlight: dollarsInFlight(data)
    }
  }
})

export default covid19ImpactEstimator;
