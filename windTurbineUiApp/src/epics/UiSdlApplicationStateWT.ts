import { setConfigInApplicationState } from '@c3/ui/UiSdlApplicationState';

export function rowRecordStoreReducer(state, action) {
  const appStateId = action.payload.componentId;
  return setConfigInApplicationState(appStateId, state, ['rowRecord'], action.payload.obj.id);
}

export function storeRowRecordAction(id, obj) {
  return {
    type: id + '.ROW_RECORD_STORE',
    payload: {
      componentId: id,
      obj: obj
    }
  }
}

export function eventRecordStoreReducer(state, action) {
  const appStateId = action.payload.componentId;
  return setConfigInApplicationState(appStateId, state, ['eventToDelete'], action.payload.obj);
}

export function storeEventRecordAction(id, obj) {
  return {
    type: id + '.EVENT_RECORD_STORE',
    payload: {
      componentId: id,
      obj: obj
    }
  }
}