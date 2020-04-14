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
    const infections = (2 ** Math.trunc(period / 3));
    return currentlyInfected(estimate) * infections;
  };

  const severeCasesByRequestedTime = (estimate) => {
    const severeCases = infectionsByRequestedTime(estimate) * 15;
    return severeCases / 100;
  };

  const hospitalBedsByRequestedTime = (estimate) => {
    let hospitalBeds = Math.trunc((totalHospitalBeds * 35) / 100);
    hospitalBeds -= severeCasesByRequestedTime(estimate);

    return hospitalBeds;
  };

  const casesForICUByRequestedTime = (estimate) => {
    const casesForICU = infectionsByRequestedTime(estimate) * 5;
    return casesForICU / 100;
  };

  const casesForVentilatorsByRequestedTime = (estimate) => {
    const casesForVentilators = infectionsByRequestedTime(estimate) * 2;
    return casesForVentilators / 100;
  };

  const dollarsInFlight = (estimate) => {
    let dollars = infectionsByRequestedTime(estimate);
    dollars *= region.avgDailyIncomePopulation;
    dollars *= region.avgDailyIncomeInUSD;
    dollars = dollars / period;

    return dollars;
  };

  const output = () => ({
    data,
    impact: {
      currentlyInfected: currentlyInfected(10),
      infectionsByRequestedTime: infectionsByRequestedTime(10),
      severeCasesByRequestedTime: Math.trunc(severeCasesByRequestedTime(10)),
      hospitalBedsByRequestedTime: Math.trunc(hospitalBedsByRequestedTime(10)),
      casesForICUByRequestedTime: Math.trunc(casesForICUByRequestedTime(10)),
      casesForVentilatorsByRequestedTime: Math.trunc(casesForVentilatorsByRequestedTime(10)),
      dollarsInFlight: Math.trunc(dollarsInFlight(10))
    },
    severeImpact: {
      currentlyInfected: currentlyInfected(50),
      infectionsByRequestedTime: infectionsByRequestedTime(50),
      severeCasesByRequestedTime: Math.trunc(severeCasesByRequestedTime(50)),
      hospitalBedsByRequestedTime: Math.trunc(hospitalBedsByRequestedTime(50)),
      casesForICUByRequestedTime: Math.trunc(casesForICUByRequestedTime(50)),
      casesForVentilatorsByRequestedTime: Math.trunc(casesForVentilatorsByRequestedTime(50)),
      dollarsInFlight: Math.trunc(dollarsInFlight(50))
    }
  });

  return output();
};

export default covid19ImpactEstimator;
