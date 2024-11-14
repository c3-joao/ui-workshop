import { concat, of, EMPTY } from "rxjs"; //import concat and of if triggering multiple actions
import { mergeMap } from "rxjs/operators"; //import mergeMap instead of map if triggering multiple actions
import { mergeArgumentsAction, requestDataAction } from "@c3/ui/UiSdlDataRedux";
import DateTime from "@c3/ui/UiSdlDateTime";

export function epic(actionStream, _stateStream) {
  var startDate, endDate;
  return actionStream.pipe(
    //change from map to mergeMap if triggering multiple actions
    mergeMap(function (action) {
      const payload = action.payload;
      if (payload?.value?.field === "model.manufacturer.name") {
        return concat(
          of(
            mergeArgumentsAction(
              `${payload.componentId}_dataSpec_fieldSets_1_fields_1_filterElement_inputElement_dataSpec_ds`,
              { spec: { filter: payload?.value?.value ? `intersects(model.manufacturer.name, ${JSON.stringify(payload.value.value)})`: "" } },
              payload.componentId
            )
          ),
          of(
            requestDataAction(
              `${payload.componentId}_dataSpec_fieldSets_1_fields_1_filterElement_inputElement_dataSpec_ds`
            )
          )
        );
      }
      return EMPTY;
    })
  );
}
