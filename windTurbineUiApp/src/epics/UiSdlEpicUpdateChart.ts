import { concat,of } from 'rxjs'; //import concat and of if triggering multiple actions
import { mergeMap } from 'rxjs/operators'; //import mergeMap instead of map if triggering multiple actions
import { updateDisplayDateAction, updateDataFilterAction } from '@c3/ui/UiSdlTimeseriesLineBarChart';
import DateTime from '@c3/ui/UiSdlDateTime';
 


export function epic(actionStream, _stateStream) {
  var startDate, endDate;
  return actionStream.pipe(
    //change from map to mergeMap if triggering multiple actions
    mergeMap(function (action) {
      const payload = action.payload;

      // this line sets the datetime picker to a week before the Measurement timestamp (this is NOT the start date which applies to Events.)
      startDate = new DateTime(payload.dataItem.obj.timestamp).plusDays(-7).toString();
      
        //use concat and of if triggering multiple actions. you should set month to day to complete the capstone.
        return concat(
            of(updateDisplayDateAction(payload.chart,startDate,endDate, 'MONTH')),
            of(updateDataFilterAction(payload.chart,startDate,endDate, 'MONTH')));
      })
  );
}		