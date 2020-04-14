const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    region,
    totalHospitalBeds
  } = data;

  let period = 0;
  if (periodType === 'days') period = timeToElapse;
  else if (periodType === 'weeks') period = timeToElapse * 7;
  else if (periodType === 'months') period = timeToElapse * 30;

  const currentlyInfected = (estimate) => reportedCases * estimate;

  const infectionsByRequestedTime = (estimate) => {
    const infectionsByReqTime = (2 ** Math.trunc(period / 3));
    return currentlyInfected(estimate) * infectionsByReqTime;
  };

  const dollarsInFlight = (estimate) => {
    let dollarsInFlights = infectionsByRequestedTime(estimate);
    dollarsInFlights *= region.avgDailyIncomePopulation;
    dollarsInFlights *= region.avgDailyIncomeInUSD;
    dollarsInFlights = Math.trunc(dollarsInFlights / period);

    return dollarsInFlights;
  };

  const hospitalBedsByRequestedTime = (estimate) => {
    let hospitalBedsByRequestedTimes = Math.trunc(totalHospitalBeds * 0.35);
    const severeCasesByRequestedTime = infectionsByRequestedTime(estimate);
    hospitalBedsByRequestedTimes -= Math.trunc(severeCasesByRequestedTime * 0.15);

    return hospitalBedsByRequestedTimes;
  };

  const output = () => ({
    data,
    impact: {
      currentlyInfected: currentlyInfected(10),
      infectionsByRequestedTime: infectionsByRequestedTime(10),
      severeCasesByRequestedTime: Math.trunc(infectionsByRequestedTime(10) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(10),
      casesForICUByRequestedTime: Math.trunc(infectionsByRequestedTime(10) * 0.05),
      casesForVentilatorsByRequestedTime: Math.trunc(infectionsByRequestedTime(10) * 0.02),
      dollarsInFlight: dollarsInFlight(10)
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
  });

  return output();
};

export default covid19ImpactEstimator;
