function get() {
  var assetCount = WindTurbine.fetchCount();
  var eventCount = WindTurbineEvent.fetchCount();
  var measurementCount = WindTurbineMeasurement.fetchCount();

  return {
    numAssets: assetCount,
    numEvents: eventCount,
    numMeasurements: measurementCount,
  };
}
