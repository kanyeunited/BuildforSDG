// Day Format

const period = (data) => {
  if(data.periodType.toLowerCase() == "days" || data.periodType.toLowerCase() == "day"){
    return data.timeToElapse;
  }else if(data.periodType.toLowerCase() == "weeks" || data.periodType.toLowerCase() == "week"){
    return data.timeToElapse * 7;
  }else if(data.periodType.toLowerCase() == "months" || data.periodType.toLowerCase() == "month"){
    return data.timeToElapse * 30;
  }
}

// Impact Functions

const impact_currentlyInfected = (data) => {
  return data.reportedCases * 10;
}

const impact_infectionsByRequestedTime = (data, period, impact_currentlyInfected) => {
  return impact_currentlyInfected * (2 ^ Number(period / 3));
}

const impact_severeCasesByRequestedTime = (impact_infectionsByRequestedTime) => {
  return Number(impact_infectionsByRequestedTime * 0.15);
}

const impact_totalHospitalBeds = (data) => {
  return Number(data.totalHospitalBeds * 0.35);
}

const impact_hospitalBedsByRequestedTime = (impact_totalHospitalBeds, impact_severeCasesByRequestedTime) => {
  return impact_totalHospitalBeds - impact_severeCasesByRequestedTime;
}

const impact_casesForICUByRequestedTime = (impact_infectionsByRequestedTime) => {
  return Number(impact_infectionsByRequestedTime * 0.05);
}

const impact_casesForVentilatorsByRequestedTime = (impact_infectionsByRequestedTime) => {
  return Number(impact_infectionsByRequestedTime * 0.02);
}

const dollarsInFlight = (data, period, impact_infectionsByRequestedTime) => {
  return Number((impact_infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / period);
}

// severeImpact Functions

const severeImpact_currentlyInfected = (data) => {
  return data.reportedCases * 50;
}

const severeImpact_infectionsByRequestedTime = (data, period, severeImpact_currentlyInfected) => {
  return severeImpact_currentlyInfected * (2 ^ Number(period / 3));
}

const severeImpact_severeCasesByRequestedTime = (severeImpact_infectionsByRequestedTime) => {
  return Number(severeImpact_infectionsByRequestedTime * 0.15);
}

const severeImpact_totalHospitalBeds = (data) => {
  return Number(data.totalHospitalBeds * 0.35);
}

const severeImpact_hospitalBedsByRequestedTime = (severeImpact_totalHospitalBeds, severeImpact_severeCasesByRequestedTime) => {
  return severeImpact_totalHospitalBeds - severeImpact_severeCasesByRequestedTime;
}

const severeImpact_casesForICUByRequestedTime = (severeImpact_infectionsByRequestedTime) => {
  return Number(severeImpact_infectionsByRequestedTime * 0.05);
}

const severeImpact_casesForVentilatorsByRequestedTime = (severeImpact_infectionsByRequestedTime) => {
  return Number(severeImpact_infectionsByRequestedTime * 0.02);
}

const dollarsInFlight = (data, period, severeImpact_infectionsByRequestedTime) => {
  return Number((severeImpact_infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / period);
}

// Output Function

const covid19ImpactEstimator = (data) => {
  "data": data,
  "estimate": {
    "impact": {
      "currentlyInfected": impact_currentlyInfected,
      "infectionsByRequestedTime": impact_infectionsByRequestedTime,
      "severeCasesByRequestedTime": impact_severeCasesByRequestedTime,
      "hospitalBedsByRequestedTime": impact_hospitalBedsByRequestedTime,
      "casesForICUByRequestedTime": impact_casesForICUByRequestedTime,
      "casesForVentilatorsByRequestedTime": impact_casesForVentilatorsByRequestedTime,
      "dollarsInFlight": impact_dollarsInFlight
    },
    "severeImpact": {
      "currentlyInfected": severeImpact_currentlyInfected,
      "infectionsByRequestedTime": severeImpact_infectionsByRequestedTime,
      "severeCasesByRequestedTime": severeImpact_severeCasesByRequestedTime,
      "hospitalBedsByRequestedTime": severeImpact_hospitalBedsByRequestedTime,
      "casesForICUByRequestedTime": severeImpact_casesForICUByRequestedTime,
      "casesForVentilatorsByRequestedTime": severeImpact_casesForVentilatorsByRequestedTime,
      "dollarsInFlight": severeImpact_dollarsInFlight
    }
  }
};

export default covid19ImpactEstimator;

const getResponseFormat = () => {
  return input('Enter Response Format!');
}

const fetchInput = () => {

  let ResponseFormat = getResponseFormat().toLowerCase();
      if(ResponseFormat=="") ResponseFormat = "json";

		fetch('http://example.com/api/v1/on-covid-19/' + ResponseFormat)
		  .then( (response) => {
        if(ResponseFormat == "xml") return response.xml();
        else return response.json();
		       })
		         .then ((data) => {
			             covid19ImpactEstimator(data);
                   fetchLogs(ResponseFormat);
		              })
		                .catch((err) => {
			                     console.error(err);
		                       });

                         };

const fetchLogs = (ResponseFormat) => {

  let messageHeaders = new Headers();
      messageHeaders.append('Content-Type','application/' + ResponseFormat);

		fetch('http://example.com/api/v1/on-covid-19/logs', {method: 'GET', headers: messageHeaders})
		  .then( (response) => {
              response.text();
		       })
		         .then ((data) => {
			              console.log(data);
		              })
		                .catch((err) => {
			                     console.error(err);
		                       });

                         };

const startApp = () => {
                         	fetchInput();
                        };

startApp();
