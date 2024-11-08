function gearOilTemperatureStats(turbineId) {

    var filter = Filter.eq("turbineId", turbineId);
    var dblAry = ArrayType.ofDbl().makeBuilder();
    var fetchSpec = FetchSpec.make({filter: filter});
    var measurements = WindTurbineMeasurement.fetch(fetchSpec);

    if (measurements.count > 0) {
        measurements.objs.each(function (m) {
            dblAry.push(m.gearOilTemperature);
        })

        dblAry = dblAry.build();

        return dblAry.descriptiveStatistics();
    } else {
        return null;
    }
}


function randomTurbine() {

    var i  = Math.floor(Math.random()*79);
    var turbine = WindTurbine.forId(i);

    return i;
}


function eventStats (turbineId) {

    var filter = Filter.eq("turbineId", turbineId);

    var j = WindTurbineEvent.fetch({filter: filter})

    return j
  }
  


  function countryStats (country) {

    var filter = Filter.eq("country", country);

    var j = WindTurbine.fetch({filter: filter})

    return j
  }
  