import { concat, of, EMPTY } from "rxjs"; //import concat and of if triggering multiple actions
import { mergeMap } from "rxjs/operators"; //import mergeMap instead of map if triggering multiple actions
import { getConfigFromState } from "@c3/ui/UiSdlConnected";
import { filterHeatMapAction } from "@c3/ui/UiSdlApplicationStateWT";
import Filter from "@c3/ui/UiSdlFilter";
import isArray from 'lodash/isArray';

export function epic(actionStream, stateStream) {
  return actionStream.pipe(
    //change from map to mergeMap if triggering multiple actions
    mergeMap(function (action) {
      const payload = action.payload;
      const fields = getConfigFromState('WindTurbine.TurbineHeatMapFilterPanel', stateStream.value, ['formFieldValues']).toJS();
      let turbineFilter = new Filter('1 == 1');
      let eventFilter = new Filter('1 == 1');
      Object.keys(fields).forEach((field) => {
        if (field !== 'event_code') {
          if (fields[field].value) {
            const operator = fields[field].operator;
            if (operator === 'EQUALS') {
              if (isArray(fields[field].value)) {
                turbineFilter = turbineFilter.and().intersects(field, fields[field].value);
              } else {
                turbineFilter = turbineFilter.and().eq(field, fields[field].value);
              }
            } else if (operator === 'IN_BETWEEN') {
              turbineFilter = turbineFilter.and().ge(field, fields[field].value[0]).and().le(field, fields[field].value[1]);
            }
          }
        } else if (fields[field].value) {
          eventFilter = eventFilter.and().intersects(field, fields[field].value);
        }
      })
      return concat(
        of(
          filterHeatMapAction(
            "WindTurbine.ApplicationState",
            { turbineFilter: turbineFilter.toString(), eventFilter: eventFilter.toString() },
          )
        ),
      );
    })
  );
}
