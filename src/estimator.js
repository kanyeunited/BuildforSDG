const covid19ImpactEstimator = (data) => data;

const impact = (data) => {
  const {
    region,
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  } = data

  const period = "";

  if(data.periodType === "days"){
      period = data.timeToElapse;
    }else if(data.periodType === "weeks"){
      period = data.timeToElapse * 7;
    }else if(data.periodType === "months"){
      period = data.timeToElapse * 30;
    }

  const currentlyInfected = data.reportedCases * 10;
  const infectionsByRequestedTime = currentlyInfected * (2 ^ Number(period / 3));
  const severeCasesByRequestedTime =  Number(infectionsByRequestedTime * 0.15);
  const hospitalBedsByRequestedTime = (data.totalHospitalBeds * 0.35) - severeCasesByRequestedTime;
  const casesForICUByRequestedTime = Number(infectionsByRequestedTime * 0.05);
  const casesForVentilatorsByRequestedTime = Number(infectionsByRequestedTime * 0.02);
  const dollarsInFlight = Number((infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / period);

}

const severeImpact = (data) => {
  const {
    region,
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  } = data

  const period = "";

  if(data.periodType === "days"){
      period = data.timeToElapse;
    }else if(data.periodType === "weeks"){
      period = data.timeToElapse * 7;
    }else if(data.periodType === "months"){
      period = data.timeToElapse * 30;
    }

  const currentlyInfected = data.reportedCases * 50;
  const infectionsByRequestedTime = currentlyInfected * (2 ^ Number(period / 3));
  const severeCasesByRequestedTime =  Number(infectionsByRequestedTime * 0.15);
  const hospitalBedsByRequestedTime = (data.totalHospitalBeds * 0.35) - severeCasesByRequestedTime;
  const casesForICUByRequestedTime = Number(infectionsByRequestedTime * 0.05);
  const casesForVentilatorsByRequestedTime = Number(infectionsByRequestedTime * 0.02);
  const dollarsInFlight = Number((infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / period);

}

export default covid19ImpactEstimator;

export {impact, severeImpact};
