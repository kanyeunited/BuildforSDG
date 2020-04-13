const impact = (data) => {
  let period = 0;
  if (data.periodType === 'days')  period = data.timeToElapse;
    else if (data.periodType === 'weeks') period = data.timeToElapse * 7;
    else if (data.periodType === 'months') period = data.timeToElapse * 30;

  const currentlyInfected = data.reportedCases * 10;
  const infectionsByRequestedTime = currentlyInfected * (2 ** Number(period / 3));
  const severeCasesByRequestedTime = Number(infectionsByRequestedTime * 0.15);
  const hospitalBedsByRequestedTime = (data.totalHospitalBeds * 0.35) - this.severeCasesByRequestedTime;
  const casesForICUByRequestedTime = Number(infectionsByRequestedTime * 0.05);
  const casesForVentilatorsByRequestedTime = Number(infectionsByRequestedTime * 0.02);
  const dollarsInFlight = infectionsByRequestedTime * data.region.avgDailyIncomePopulation;
        dollarsInFlight *= data.region.avgDailyIncomeInUSD;
        dollarsInFlight = Number(dollarsInFlight / period);
        
  return{
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

const severeImpact = (data) => {
  let period = 0;
  if (data.periodType === 'days') period = data.timeToElapse;
    else if (data.periodType === 'weeks') period = data.timeToElapse * 7;
    else if (data.periodType === 'months') period = data.timeToElapse * 30;

  const currentlyInfected = data.reportedCases * 50;
  const infectionsByRequestedTime = currentlyInfected * (2 ** Number(period / 3));
  const severeCasesByRequestedTime = Number(infectionsByRequestedTime * 0.15);
  const hospitalBedsByRequestedTime = (data.totalHospitalBeds * 0.35) - this.severeCasesByRequestedTime;
  const casesForICUByRequestedTime = Number(infectionsByRequestedTime * 0.05);
  const casesForVentilatorsByRequestedTime = Number(infectionsByRequestedTime * 0.02);
  const dollarsInFlight = infectionsByRequestedTime * data.region.avgDailyIncomePopulation;
        dollarsInFlight *= data.region.avgDailyIncomeInUSD;
        dollarsInFlight = Number(dollarsInFlight / period);

  return{
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

const covid19ImpactEstimator = (data) => ({
  data: data,
  estimate: {
    impact:{
      currentlyInfected: impact(data).currentlyInfected,
      infectionsByRequestedTime: impact(data).infectionsByRequestedTime,
      severeCasesByRequestedTime: impact(data).severeCasesByRequestedTime,
      hospitalBedsByRequestedTime: impact(data).hospitalBedsByRequestedTime,
      casesForICUByRequestedTime: impact(data).casesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: impact(data).casesForVentilatorsByRequestedTime,
      dollarsInFlight: impact(data).dollarsInFlight
    },
    severeImpact: {
      currentlyInfected: severeImpact(data).currentlyInfected,
      infectionsByRequestedTime: severeImpact(data).infectionsByRequestedTime,
      severeCasesByRequestedTime: severeImpact(data).severeCasesByRequestedTime,
      hospitalBedsByRequestedTime: severeImpact(data).hospitalBedsByRequestedTime,
      casesForICUByRequestedTime: severeImpact(data).casesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: severeImpact(data).casesForVentilatorsByRequestedTime,
      dollarsInFlight: severeImpact(data).dollarsInFlight
    }
  }
})

export default covid19ImpactEstimator;
