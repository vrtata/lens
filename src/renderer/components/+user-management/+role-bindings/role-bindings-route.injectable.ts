/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../../common/utils/is-allowed-resource.injectable";
import userManagementRouteInjectable from "../user-management-route.injectable";
import { RoleBindings } from "./view";
import { routeInjectionToken } from "../../../routes/all-routes.injectable";

const roleBindingsRouteInjectable = getInjectable({
  id: "role-bindings-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return ({
      title: "Role Bindings",
      Component: RoleBindings,
      path: "/role-bindings",
      parent: di.inject(userManagementRouteInjectable),
      clusterFrame: true,
      mikko: () => isAllowedResource("rolebindings"),
    });
  },

  injectionToken: routeInjectionToken,
});

export default roleBindingsRouteInjectable;