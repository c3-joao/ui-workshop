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
      if (payload?.value?.field === "country") {
        return concat(
          of(
            mergeArgumentsAction(
              "WindTurbine.TurbineMapFilterPanel_dataSpec_fieldSets_0_fields_1_filterElement_inputElement_dataSpec_ds",
              { spec: { filter: payload?.value?.value ? `country == "${payload.value.value}"`: "" } },
              payload.componentId
            )
          ),
          of(
            requestDataAction(
              "WindTurbine.TurbineMapFilterPanel_dataSpec_fieldSets_0_fields_1_filterElement_inputElement_dataSpec_ds"
            )
          )
        );
      }
      return EMPTY;
    })
  );
}
