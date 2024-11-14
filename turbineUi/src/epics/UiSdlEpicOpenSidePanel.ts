/*
 * Copyright 2009-2023 C3 AI (www.c3.ai). All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

import { flatMap } from 'rxjs/operators';
import { concat, of } from 'rxjs';
import { updateHeaderAction, openCloseSidePanelAction } from '@c3/ui/UiSdlSidePanel';
import { storeRowRecordAction } from '@c3/ui/UiSdlApplicationStateWT';
import { UiSdlActionsObservable, UiSdlStatesObservable } from '@c3/types';

export function epic(
  actionStream: UiSdlActionsObservable,
  _stateStream: UiSdlStatesObservable
): UiSdlActionsObservable {
  return actionStream.pipe(
    flatMap(function (action) {
      const applicationStateId = action.payload?.applicationStateId;
      const sidePanelId = action.payload?.sidePanelId;
      const obj = action.payload?.dataItem?.obj;

      return concat(of(storeRowRecordAction(applicationStateId, obj)), of(openCloseSidePanelAction(sidePanelId, true)));
    })
  );
}
