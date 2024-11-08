function evaluate(spec) {
  var tuples = [];
  var turbineWithEventsCount = [];
  var windTurbineObjects = WindTurbine.fetch().objs;
  windTurbineObjects.each(function (windTurbine) {
    var eventsCount = windTurbine.events.length;
    turbineWithEventsCount.push([windTurbine.turbineId, eventsCount]);
  });
  turbineWithEventsCount.sort((a,b) => { return b[1] - a[1] });

  for (var i = 0; i < 5; i++) {
    var currentTurbineId = turbineWithEventsCount[i][0];
   tuples.push(CellTuple.make({
      cells: [
        { str: currentTurbineId }, {m1: 4}, {m2: 5 }, {m3: 2}
      ]
    })
   );
  }

  return EvaluateResult.make({
    tuples: tuples,
    count: 5,
    hasMore: false,
  });
}
