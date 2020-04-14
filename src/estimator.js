const covid19ImpactEstimator = (result) => {
  const [data] = result;

  const currentlyInfected = (estimate) => data.reportedCases * estimate;

  const infectionsByRequestedTime = (estimate) => {
    let period = 0;
    if (data.periodType === 'days') period = data.timeToElapse;
    else if (data.periodType === 'weeks') period = data.timeToElapse * 7;
    else if (data.periodType === 'months') period = data.timeToElapse * 30;

    return currentlyInfected(estimate) * (2 ** Math.trunc(period / 3));
  };

  const dollarsInFlight = (estimate) => {
    let period = 0;
    if (data.periodType === 'days') period = data.timeToElapse;
    else if (data.periodType === 'weeks') period = data.timeToElapse * 7;
    else if (data.periodType === 'months') period = data.timeToElapse * 30;

    let dollarsInFlights = infectionsByRequestedTime(estimate);
    dollarsInFlights *= data.region.avgDailyIncomePopulation;
    dollarsInFlights *= data.region.avgDailyIncomeInUSD;
    dollarsInFlights = Math.trunc(dollarsInFlights / period);

    return dollarsInFlights;
  };

  const hospitalBedsByRequestedTime = (estimate) => {
    let hospitalBedsByRequestedTimes = Math.trunc(data.totalHospitalBeds * 0.35);
    const severeCasesByRequestedTime = infectionsByRequestedTime(estimate);
    hospitalBedsByRequestedTimes -= Math.trunc(severeCasesByRequestedTime * 0.15);

    return hospitalBedsByRequestedTimes;
  };

  const output = () => ({
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

  return output();
};

export default covid19ImpactEstimator;
