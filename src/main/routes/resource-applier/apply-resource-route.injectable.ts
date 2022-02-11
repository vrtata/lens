/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../router/router.injectable";
import type { LensApiRequest } from "../../router";
import { apiPrefix } from "../../../common/vars";
import { ResourceApplier } from "../../resource-applier";
import { respondJson, respondText } from "../../utils/http-responses";

const applyResourceRouteInjectable = getInjectable({
  id: "apply-resource-route",

  instantiate: () => ({
    method: "post",
    path: `${apiPrefix}/stack`,

    handler: async (request: LensApiRequest) => {
      const { response, cluster, payload } = request;

      try {
        const resource = await new ResourceApplier(cluster).apply(payload);

        respondJson(response, resource, 200);
      } catch (error) {
        respondText(response, error, 422);
      }
    },
  }),

  injectionToken: routeInjectionToken,
});

export default applyResourceRouteInjectable;