/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { SubTitle } from "../layout/sub-title";
import type { RegisteredAppPreference } from "../../../extensions/registries/app-preference-registry";
import React from "react";
import { cssNames } from "../../../renderer/utils";

interface ExtensionSettingsProps {
  setting: RegisteredAppPreference;
  size: "small" | "normal"
}

export function ExtensionSettings({ setting, size }: ExtensionSettingsProps) {
  const {
    title,
    id,
    components: { Hint, Input },
  } = setting;

  return (
    <React.Fragment>
      <section id={id} className={cssNames(size)}>
        <SubTitle title={title} />
        <Input />
        <div className="hint">
          <Hint />
        </div>
      </section>
      <hr className={cssNames(size)} />
    </React.Fragment>
  );
}