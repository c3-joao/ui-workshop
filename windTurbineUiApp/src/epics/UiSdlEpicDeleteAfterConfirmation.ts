import { of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
// Import the methods needed from the UiSdl component
import { ajax, requestDataAction } from '@c3/ui/UiSdlDataRedux';
import { getConfigFromApplicationState } from '@c3/ui/UiSdlApplicationState';
import { withName } from '@c3/ui/UiSdlLogger';

const logger = withName('UiSdlEpicDeleteAfterConfirmation');

// Overrides the epic method
export function epic(actionStream, _stateStream) {

  return actionStream.pipe(
    mergeMap(function (action) {

      //application state to get event id
      const applicationStateId = action.payload.componentId;

      //state
      const state = _stateStream.value;
      //event to delete
      const eventToDelete = getConfigFromApplicationState(applicationStateId, state, ['eventToDelete']);
      //table to refresh
      const tableToRefresh = action.payload.tableToRefresh;

      return ajax('WindTurbineEvent', 'remove', {
        this: { id: eventToDelete }
      }).pipe(
        mergeMap(function () {
          return of(requestDataAction(tableToRefresh + '_dataSpec_ds'));
        })
      )
    }),
    catchError(function (error) {
      logger.error(error);
      throw error;
    }
    )

  )
}