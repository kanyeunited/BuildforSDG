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
    const severeCases = infectionsByRequestedTime(estimate) * 0.15;
    return severeCases;
  };

  const hospitalBedsByRequestedTime = (estimate) => {
    let hospitalBeds = totalHospitalBeds * 0.35;
    hospitalBeds -= severeCasesByRequestedTime(estimate);

    return hospitalBeds;
  };

  const casesForICUByRequestedTime = (estimate) => {
    const casesForICU = infectionsByRequestedTime(estimate) * 0.05;
    return casesForICU;
  };

  const casesForVentilatorsByRequestedTime = (estimate) => {
    const casesForVentilators = infectionsByRequestedTime(estimate) * 0.02;
    return casesForVentilators;
  };

  const dollarsInFlight = (estimate) => {
    let dollars = infectionsByRequestedTime(estimate);
    dollars *= region.avgDailyIncomePopulation;
    dollars *= region.avgDailyIncomeInUSD;
    dollars /= period;

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
/*
const fetchLogs = (ResponseFormat) => {
  const contentType = 'application/' + ResponseFormat;
  const messageHeaders = new Headers('Content-Type', contentType);
  messageHeaders.append();

  fetch('http://example.com/api/v1/on-covid-19/logs', {
    method: 'GET',
    headers: messageHeaders
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
      .catch((err) => console.error(err));
};

const fetchInput = () => {
  const getResponseFormat = prompt('Enter Response Format!');

  let ResponseFormat = getResponseFormat().toLowerCase();
  if (ResponseFormat === '') ResponseFormat = 'json';

  const api = 'http://example.com/api/v1/on-covid-19/' + ResponseFormat;

  fetch(api)
    .then((response) => ResponseFormat === 'xml' ? response.xml() : response.json())
    .then((data) => {
      covid19ImpactEstimator(data);
      fetchLogs(ResponseFormat);
    })
      .catch((err) => {
        console.error(err);
      });
};

const startApp = () => {
  fetchInput();
};

startApp();
*/
