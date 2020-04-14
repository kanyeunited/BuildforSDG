let period = 0;
const i = 10;
const j = 50;

const currentlyInfected = (results, estimate) => {
  const [data] = results;
  const { reportedCases } = data;
  return reportedCases * estimate;
};

const infectionsByRequestedTime = (results, estimate) => {
  const [data] = results;
  const { periodType, timeToElapse } = data;
  if (periodType.toLowerCase() === 'days') period = timeToElapse;
  else if (periodType.toLowerCase() === 'weeks') period = timeToElapse * 7;
  else if (periodType.trimtoLowerCase() === 'months') period = timeToElapse * 30;

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
      currentlyInfected: currentlyInfected(data, i),
      infectionsByRequestedTime: infectionsByRequestedTime(data, i),
      severeCasesByRequestedTime: Math.trunc(infectionsByRequestedTime(data, i) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(data, i),
      casesForICUByRequestedTime: Math.trunc(infectionsByRequestedTime(data, i) * 0.05),
      casesForVentilatorsByRequestedTime: Math.trunc(infectionsByRequestedTime(data, i) * 0.02),
      dollarsInFlight: dollarsInFlight(data, i)
    },
    severeImpact: {
      currentlyInfected: currentlyInfected(data, j),
      infectionsByRequestedTime: infectionsByRequestedTime(data, j),
      severeCasesByRequestedTime: Math.trunc(infectionsByRequestedTime(data, j) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(data, j),
      casesForICUByRequestedTime: Math.trunc(infectionsByRequestedTime(data, j) * 0.05),
      casesForVentilatorsByRequestedTime: Math.trunc(infectionsByRequestedTime(data, j) * 0.02),
      dollarsInFlight: dollarsInFlight(data, j)
    }
  }
});

export default covid19ImpactEstimator;
