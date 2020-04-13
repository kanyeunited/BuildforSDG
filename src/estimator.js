const covid19ImpactEstimator = (data) => {
  const {
    region,
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  } = data;

  let period = 0;

if (data.periodType === 'days')  period = data.timeToElapse;
  else if (data.periodType === 'weeks') period = data.timeToElapse * 7;
  else if (data.periodType === 'months') period = data.timeToElapse * 30;

  const infectionsByRequestedTime = () => {
    return this.currentlyInfected * (2 ** Number(period / 3));
  };

  const severeCasesByRequestedTime = () => {
    return Number(this.infectionsByRequestedTime * 0.15);
  };

  const hospitalBedsByRequestedTime = () => {
    return (data.totalHospitalBeds * 0.35) - this.severeCasesByRequestedTime;
  };

  const casesForICUByRequestedTime = () => {
    return Number(this.infectionsByRequestedTime * 0.05);
  };

  const casesForVentilatorsByRequestedTime = () => {
    return Number(this.infectionsByRequestedTime * 0.02);
  };

  const dollarsInFlight = () => {
    return Number((infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / period);
  };

  const impact = (data) => {
    currentlyInfected: data.reportedCases * 10,
    infectionsByRequestedTime: infectionsByRequestedTime,
    severeCasesByRequestedTime: severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: hospitalBedsByRequestedTime,
    casesForICUByRequestedTime: casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTime,
    dollarsInFlight: dollarsInFlight
  };

  const severeImpact = (data) => {
    currentlyInfected: data.reportedCases * 50,
    infectionsByRequestedTime: infectionsByRequestedTime,
    severeCasesByRequestedTime: severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: hospitalBedsByRequestedTime,
    casesForICUByRequestedTime: casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTime,
    dollarsInFlight: dollarsInFlight
  };

  const estimate = {
    estimate: {
      impact: impact,
      severeImpact: severeImpact
    };
  }
}

export default covid19ImpactEstimator;
