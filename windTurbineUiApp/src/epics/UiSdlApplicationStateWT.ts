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

export function heatMapFilterReducer(state, action) {
  const appStateId = action.payload.componentId;
  state = setConfigInApplicationState(appStateId, state, ['turbineFilter'], action.payload.obj.turbineFilter);
  return setConfigInApplicationState(appStateId, state, ['eventFilter'], action.payload.obj.eventFilter);
}

export function filterHeatMapAction(id, obj) {
  return {
    type: id + '.HEAT_MAP_FILTER_ADD',
    payload: {
      componentId: id,
      obj: obj
    }
  }
}