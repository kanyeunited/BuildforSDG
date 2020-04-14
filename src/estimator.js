let period = 0;

const infectionsByRequestedTime = (data, currentlyInfected) => {
  if (data.periodType === 'days') period = data.timeToElapse;
  else if (data.periodType === 'weeks') period = data.timeToElapse * 7;
  else if (data.periodType === 'months') period = data.timeToElapse * 30;

  return currentlyInfected * (2 ** Number(period / 3));
};

const dollarsInFlight = (data, currentlyInfected) => {
  let dollarsInFlights = infectionsByRequestedTime(data, currentlyInfected);
  dollarsInFlights *= data.region.avgDailyIncomePopulation;
  dollarsInFlights *= data.region.avgDailyIncomeInUSD;
  dollarsInFlights = Number(dollarsInFlights / period);

  return dollarsInFlights;
};

const hospitalBedsByRequestedTime = (data, currentlyInfected) => {
  let hospitalBedsByRequestedTimes = Number(data.totalHospitalBeds * 0.35);
  let severeCasesByRequestedTime = infectionsByRequestedTime(data, currentlyInfected);
  hospitalBedsByRequestedTimes -= Number(severeCasesByRequestedTime * 0.15);

  return hospitalBedsByRequestedTimes;
};

const covid19ImpactEstimator = (data) => ({
  data,
  estimate: {
    impact: {
      currentlyInfected: data.reportedCases * 10,
      infectionsByRequestedTime: infectionsByRequestedTime(data, 10),
      severeCasesByRequestedTime: Number(infectionsByRequestedTime(data, 10) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(data, 10),
      casesForICUByRequestedTime: Number(infectionsByRequestedTime(data, 10) * 0.05),
      casesForVentilatorsByRequestedTime: Number(infectionsByRequestedTime(data, 10) * 0.02),
      dollarsInFlight: dollarsInFlight(data, 10)
    },
    severeImpact: {
      currentlyInfected: data.reportedCases * 50,
      infectionsByRequestedTime: infectionsByRequestedTime(data, 50),
      severeCasesByRequestedTime: Number(infectionsByRequestedTime(data, 50) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(data, 50),
      casesForICUByRequestedTime: Number(infectionsByRequestedTime(data, 50) * 0.05),
      casesForVentilatorsByRequestedTime: Number(infectionsByRequestedTime(data, 50) * 0.02),
      dollarsInFlight: dollarsInFlight(data, 50)
    }
  }
});

export default covid19ImpactEstimator;
