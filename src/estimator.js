const output = (data) => ({
  data,
  estimate: {
    impact: {
      currentlyInfected: currentlyInfected(10),
      infectionsByRequestedTime: infectionsByRequestedTime(10),
      severeCasesByRequestedTime: Math.trunc(infectionsByRequestedTime(10) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(10),
      casesForICUByRequestedTime: Math.trunc(infectionsByRequestedTime(10) * 0.05),
      casesForVentilatorsByRequestedTime: Math.trunc(infectionsByRequestedTime(10) * 0.02),
      dollarsInFlight: dollarsInFlight(50)
    },
    severeImpact: {
      currentlyInfected: currentlyInfected(50),
      infectionsByRequestedTime: infectionsByRequestedTime(50),
      severeCasesByRequestedTime: Math.trunc(infectionsByRequestedTime(50) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(50),
      casesForICUByRequestedTime: Math.trunc(infectionsByRequestedTime(50) * 0.05),
      casesForVentilatorsByRequestedTime: Math.trunc(infectionsByRequestedTime(50) * 0.02),
      dollarsInFlight: dollarsInFlight(50)
    }
  }
});

const covid19ImpactEstimator = (data) => {
  const [data] = data;

  const {
    reportedCases,
    periodType,
    timeToElapse,
    region,
    totalHospitalBeds
  } = data;

  const {
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD
  } = region;

  const currentlyInfected = (estimate) => reportedCases * estimate;

  const infectionsByRequestedTime = (estimate) => {
    let period = 0;
    if (periodType === 'days') period = timeToElapse;
    else if (periodType === 'weeks') period = timeToElapse * 7;
    else if (periodType === 'months') period = timeToElapse * 30;

    return currentlyInfected(estimate) * (2 ** Math.trunc(period / 3));
  };

  const dollarsInFlight = (estimate) => {
    let period = 0;
    if (periodType === 'days') period = timeToElapse;
    else if (periodType === 'weeks') period = timeToElapse * 7;
    else if (periodType === 'months') period = timeToElapse * 30;

    let dollarsInFlights = infectionsByRequestedTime(estimate);
    dollarsInFlights *= avgDailyIncomePopulation;
    dollarsInFlights *= avgDailyIncomeInUSD;
    dollarsInFlights = Math.trunc(dollarsInFlights / period);

    return dollarsInFlights;
  };

  const hospitalBedsByRequestedTime = (estimate) => {
    let hospitalBedsByRequestedTimes = Math.trunc(totalHospitalBeds * 0.35);
    const severeCasesByRequestedTime = infectionsByRequestedTime(estimate);
    hospitalBedsByRequestedTimes -= Math.trunc(severeCasesByRequestedTime * 0.15);

    return hospitalBedsByRequestedTimes;
  };

  return output(data);
};

export default covid19ImpactEstimator;
