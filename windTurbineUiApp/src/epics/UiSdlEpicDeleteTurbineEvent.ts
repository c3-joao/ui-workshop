import { concat,of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
// Import the methods needed from the UiSdl component
import { updateModalHeaderAction , updateModalContentAction } from '@c3/ui/UiSdlModalBody'
import { openCloseModalAction } from '@c3/ui/UiSdlModal'
import { storeEventRecordAction } from '@c3/ui/UiSdlApplicationStateWT'

// Overrides the epic method
export function epic(actionStream, _stateStream) {
  return actionStream.pipe(
    mergeMap(function (action) {
        //id of the application state
        const componentId = action.payload.componentId;
        //meter event id to store in application state
        const turbineEventId = action.payload.obj.id;
        //id of the modal to update and open
        const modalToOpen = action.payload.modal;

        return concat(
            of(updateModalHeaderAction(modalToOpen ,createHeaderText(turbineEventId))),
            of(updateModalContentAction(modalToOpen ,createContentText(turbineEventId))),
            of(openCloseModalAction(modalToOpen , true)),
            of(storeEventRecordAction(componentId, turbineEventId))
            );
      }
    )
  )
}

function createHeaderText (entityId: any) {
    return "Are you sure you want to delete " + entityId + "?";
}

function createContentText (entityId: any) {
    return "This action will remove " + entityId + " permanently and cannot be undone.";
}