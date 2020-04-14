let period = 0;
const impact = 10;
const severeImpact = 50;

const currentlyInfected = (data, estimate) => data.reportedCases * estimate.parseInt();

const infectionsByRequestedTime = (data, estimate) => {
  if (data.periodType.toLowerCase() === 'days') period = data.timeToElapse;
  else if (data.periodType.toLowerCase() === 'weeks') period = data.timeToElapse * 7;
  else if (data.periodType.trimtoLowerCase() === 'months') period = data.timeToElapse * 30;

  return currentlyInfected(data, estimate) * (2 ** Math.trunc(period / 3));
};

const dollarsInFlight = (data, estimate) => {
  if (data.periodType === 'days') period = data.timeToElapse;
  else if (data.periodType === 'weeks') period = data.timeToElapse * 7;
  else if (data.periodType === 'months') period = data.timeToElapse * 30;

  let dollarsInFlights = infectionsByRequestedTime(data, estimate);
  dollarsInFlights *= data.region.avgDailyIncomePopulation;
  dollarsInFlights *= data.region.avgDailyIncomeInUSD;
  dollarsInFlights = Math.trunc(dollarsInFlights / period);

  return dollarsInFlights;
};

const hospitalBedsByRequestedTime = (data, estimate) => {
  let hospitalBedsByRequestedTimes = Math.trunc(data.totalHospitalBeds * 0.35);
  const severeCasesByRequestedTime = infectionsByRequestedTime(data, estimate);
  hospitalBedsByRequestedTimes -= Math.trunc(severeCasesByRequestedTime * 0.15);

  return hospitalBedsByRequestedTimes;
};

const covid19ImpactEstimator = (data) => ({
  data,
  estimate: {
    impact: {
      currentlyInfected: currentlyInfected(data, impact),
      infectionsByRequestedTime: infectionsByRequestedTime(data, impact),
      severeCasesByRequestedTime: Math.trunc(infectionsByRequestedTime(data, impact) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(data, impact),
      casesForICUByRequestedTime: Math.trunc(infectionsByRequestedTime(data, impact) * 0.05),
      casesForVentilatorsByRequestedTime: Math.trunc(infectionsByRequestedTime(data, impact) * 0.02),
      dollarsInFlight: dollarsInFlight(data, impact)
    },
    severeImpact: {
      currentlyInfected: currentlyInfected(data, severeImpact),
      infectionsByRequestedTime: infectionsByRequestedTime(data, severeImpact),
      severeCasesByRequestedTime: Math.trunc(infectionsByRequestedTime(data, severeImpact) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(data, severeImpact),
      casesForICUByRequestedTime: Math.trunc(infectionsByRequestedTime(data, severeImpact) * 0.05),
      casesForVentilatorsByRequestedTime: Math.trunc(infectionsByRequestedTime(data, severeImpact) * 0.02),
      dollarsInFlight: dollarsInFlight(data, severeImpact)
    }
  }
});

export default covid19ImpactEstimator;
