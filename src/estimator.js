let period = 0;

const currentlyInfected = (data, estimate) => return data.reportedCases * estimate;

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
      currentlyInfected: currentlyInfected(data, 10),
      infectionsByRequestedTime: infectionsByRequestedTime(data, 10),
      severeCasesByRequestedTime: Math.trunc(infectionsByRequestedTime(data, 10) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(data, 10),
      casesForICUByRequestedTime: Math.trunc(infectionsByRequestedTime(data, 10) * 0.05),
      casesForVentilatorsByRequestedTime: Math.trunc(infectionsByRequestedTime(data, 10) * 0.02),
      dollarsInFlight: dollarsInFlight(data, 10)
    },
    severeImpact: {
      currentlyInfected: currentlyInfected(data, 50),
      infectionsByRequestedTime: infectionsByRequestedTime(data, 50),
      severeCasesByRequestedTime: Math.trunc(infectionsByRequestedTime(data, 50) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(data, 50),
      casesForICUByRequestedTime: Math.trunc(infectionsByRequestedTime(data, 50) * 0.05),
      casesForVentilatorsByRequestedTime: Math.trunc(infectionsByRequestedTime(data, 50) * 0.02),
      dollarsInFlight: dollarsInFlight(data, 50)
    }
  }
});

export default covid19ImpactEstimator;
