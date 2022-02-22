/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { ISidebarItem } from "./sidebar";
import { computed, IComputedValue } from "mobx";
import { orderBy } from "lodash/fp";

export const getSidebarItems = (
  sidebarItemRegistrations: IComputedValue<ISidebarItem[]>[],
) =>
  computed(() => {
    const items = sidebarItemRegistrations.flatMap((sidebarItems) => sidebarItems.get());

    return orderBy(
      ["priority", "title"],
      ["asc", "asc"],
      items,
    );
  });
