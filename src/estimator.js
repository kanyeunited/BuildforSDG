const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    region,
    totalHospitalBeds
  } = data;

  const period = 0;
  if (periodType === 'days') period = timeToElapse;
  else if (periodType === 'weeks') period = timeToElapse * 7;
  else if (periodType === 'months') period = timeToElapse * 30;

  const currentlyInfected = (estimate) => reportedCases * estimate;

  const infectionsByRequestedTime = (estimate) => {
    const infectionsByReqTime = (2 ** Math.trunc(period / 3));
    return currentlyInfected(estimate) * infectionsByReqTime;
  };

  const severeCasesByRequestedTime = (estimate) => {
    return Math.trunc((infectionsByRequestedTime(estimate) * 15) / 100);
  };

  const hospitalBedsByRequestedTime = (estimate) => {
    const hospitalBedsByRequestedTimes = Math.trunc((totalHospitalBeds * 35) / 100);
    hospitalBedsByRequestedTimes -= severeCasesByRequestedTime(estimate);

    return hospitalBedsByRequestedTimes;
  };

  const casesForICUByRequestedTime = (estimate) => {
    return Math.trunc((infectionsByRequestedTime(estimate) * 5) / 100);
  };

  const casesForVentilatorsByRequestedTime = (estimate) => {
    return Math.trunc((infectionsByRequestedTime(estimate) * 2) / 100);
  };

  const dollarsInFlight = (estimate) => {
    let dollarsInFlights = infectionsByRequestedTime(estimate);
    dollarsInFlights *= region.avgDailyIncomePopulation;
    dollarsInFlights *= region.avgDailyIncomeInUSD;
    dollarsInFlights = Math.trunc(dollarsInFlights / period);

    return dollarsInFlights;
  };

  const output = () => ({
    data,
    impact: {
      currentlyInfected: currentlyInfected(10),
      infectionsByRequestedTime: infectionsByRequestedTime(10),
      severeCasesByRequestedTime: severeCasesByRequestedTime(10),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(10),
      casesForICUByRequestedTime: casesForICUByRequestedTime(10),
      casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTime(10),
      dollarsInFlight: dollarsInFlight(10)
    },
    severeImpact: {
      currentlyInfected: currentlyInfected(50),
      infectionsByRequestedTime: infectionsByRequestedTime(50),
      severeCasesByRequestedTime: severeCasesByRequestedTime(50),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(50),
      casesForICUByRequestedTime: casesForICUByRequestedTime(50),
      casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTime(50),
      dollarsInFlight: dollarsInFlight(50)
    }
  });

  return output();
};

export default covid19ImpactEstimator;
