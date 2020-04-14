let period = 0;

const infectionsByRequestedTime = ({data}, currentlyInfected) => {
  const {periodType, timeToElapse} = data;
  if (data.periodType === 'days') period = data.timeToElapse;
  else if (data.periodType === 'weeks') period = data.timeToElapse * 7;
  else if (data.periodType === 'months') period = data.timeToElapse * 30;

  return currentlyInfected * (2 ** Number(period / 3));
};

const dollarsInFlight = ({data}, currentlyInfected) => {
  const [region] = data;
  let dollarsInFlights = infectionsByRequestedTime(data, currentlyInfected);
  dollarsInFlights *= data.region.avgDailyIncomePopulation;
  dollarsInFlights *= data.region.avgDailyIncomeInUSD;
  dollarsInFlights = Number(dollarsInFlights / period);

  return dollarsInFlights;
};

const hospitalBedsByRequestedTime = ({data}, severeCasesByRequestedTime) => {
  const {totalHospitalBeds} = data;
  let hospitalBedsByRequestedTimes = data.totalHospitalBeds * 0.35;
  hospitalBedsByRequestedTimes -= severeCasesByRequestedTime;

  return hospitalBedsByRequestedTimes;
};

const covid19ImpactEstimator = (data) => ({
  data,
  estimate: {
    impact: {
      currentlyInfected: data.reportedCases * 10,
      infectionsByRequestedTime: infectionsByRequestedTime(data, this.currentlyInfected),
      severeCasesByRequestedTime: Number(infectionsByRequestedTime(data) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(data, this.severeCasesByRequestedTime),
      casesForICUByRequestedTime: Number(infectionsByRequestedTime(data, this.currentlyInfected) * 0.05),
      casesForVentilatorsByRequestedTime: Number(infectionsByRequestedTime(data, this.currentlyInfected) * 0.02),
      dollarsInFlight: dollarsInFlight(data, this.currentlyInfected)
    },
    severeImpact: {
      currentlyInfected: data.reportedCases * 10,
      infectionsByRequestedTime: infectionsByRequestedTime(data, this.currentlyInfected),
      severeCasesByRequestedTime: Number(infectionsByRequestedTime(data) * 0.15),
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(data, this.severeCasesByRequestedTime),
      casesForICUByRequestedTime: Number(infectionsByRequestedTime(data, this.currentlyInfected) * 0.05),
      casesForVentilatorsByRequestedTime: Number(infectionsByRequestedTime(data, this.currentlyInfected) * 0.02),
      dollarsInFlight: dollarsInFlight(data, this.currentlyInfected)
    }
  }
});

export default covid19ImpactEstimator;
