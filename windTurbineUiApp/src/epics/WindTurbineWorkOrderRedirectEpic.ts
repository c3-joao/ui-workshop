import { concat, of, EMPTY } from "rxjs"; //import concat and of if triggering multiple actions
import { mergeMap } from "rxjs/operators"; //import mergeMap instead of map if triggering multiple actions
import { mergeArgumentsAction, requestDataAction } from "@c3/ui/UiSdlDataRedux";
import { getPageParamFromState } from "@c3/ui/UiSdlConnected";
import DateTime from "@c3/ui/UiSdlDateTime";
import { getConfigFromApplicationState } from '@c3/ui/UiSdlApplicationState';

export function epic(actionStream, stateStream) {
  var startDate, endDate;
  return actionStream.pipe(
    //change from map to mergeMap if triggering multiple actions
    mergeMap(function (action) {
      const turbine = getConfigFromApplicationState('WindTurbine.ApplicationState', stateStream.value, ['turbine', 'id']);
      return of({
        "type" : "GLOBAL_REDIRECT",
        "payload": {
          "url": "work-orders/" + turbine,
        },
        "payloadStrategy": "MERGE"
      })
    })
  );
}
