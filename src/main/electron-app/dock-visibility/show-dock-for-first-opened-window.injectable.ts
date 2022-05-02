/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import electronAppInjectable from "../electron-app.injectable";
import { afterWindowIsOpenedInjectionToken } from "../../start-main-application/after-window-is-opened/after-window-is-opened-injection-token";

const showDockForFirstOpenedWindowInjectable = getInjectable({
  id: "show-dock-for-first-opened-window",

  instantiate: (di) => {
    const app = di.inject(electronAppInjectable);

    return {
      run: () => {
        app.dock?.show();
      },
    };
  },

  injectionToken: afterWindowIsOpenedInjectionToken,
});

export default showDockForFirstOpenedWindowInjectable;
