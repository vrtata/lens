/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { Route } from "./all-routes.injectable";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import { buildURL } from "../../common/utils/buildUrl";
import { runInAction } from "mobx";

export type NavigateToRoute = (route: Route, parameters?: {}) => void;

const navigateToRouteInjectable = getInjectable({
  id: "navigate-to-route",

  instantiate: (di): NavigateToRoute => {
    const observableHistory = di.inject(observableHistoryInjectable);

    return (route, parameters = {}) => {
      const url = buildURL(route.path)(parameters);

      runInAction(() => {
        observableHistory.push(url);
      });
    };
  },
});

export default navigateToRouteInjectable;