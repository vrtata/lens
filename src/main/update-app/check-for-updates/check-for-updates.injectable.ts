/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import selectedUpdateChannelInjectable from "../selected-update-channel.injectable";
import updatesAreBeingDiscoveredInjectable from "../../../common/application-update/updates-are-being-discovered/updates-are-being-discovered.injectable";
import discoveredUpdateVersionInjectable from "../../../common/application-update/discovered-update-version/discovered-update-version.injectable";
import { runInAction } from "mobx";
import assert from "assert";
import askBooleanInjectable from "../../ask-boolean/ask-boolean.injectable";
import quitAndInstallUpdateInjectable from "../../electron-app/features/quit-and-install-update.injectable";
import downloadUpdateInjectable from "../download-update/download-update.injectable";
import broadcastChangeInUpdatingStatusInjectable from "./broadcast-change-in-updating-status.injectable";
import checkForUpdatesStartingFromChannelInjectable from "./check-for-updates-starting-from-channel.injectable";

const checkForUpdatesInjectable = getInjectable({
  id: "check-for-updates",

  instantiate: (di) => {
    const askBoolean = di.inject(askBooleanInjectable);
    const quitAndInstallUpdate = di.inject(quitAndInstallUpdateInjectable);
    const downloadUpdate = di.inject(downloadUpdateInjectable);
    const selectedUpdateChannel = di.inject(selectedUpdateChannelInjectable);
    const broadcastChangeInUpdatingStatus = di.inject(broadcastChangeInUpdatingStatusInjectable);
    const checkingForUpdatesState = di.inject(updatesAreBeingDiscoveredInjectable);
    const discoveredVersionState = di.inject(discoveredUpdateVersionInjectable);
    const checkForUpdatesStartingFromChannel = di.inject(checkForUpdatesStartingFromChannelInjectable);

    return async () => {
      broadcastChangeInUpdatingStatus({ eventId: "checking-for-updates" });

      runInAction(() => {
        checkingForUpdatesState.set(true);
      });

      const { updateWasDiscovered, version, actualUpdateChannel } =
        await checkForUpdatesStartingFromChannel(selectedUpdateChannel.value.get());

      if (!updateWasDiscovered) {
        broadcastChangeInUpdatingStatus({ eventId: "no-updates-available" });

        runInAction(() => {
          discoveredVersionState.set(null);
          checkingForUpdatesState.set(false);
        });

        return;
      }

      broadcastChangeInUpdatingStatus({
        eventId: "download-for-update-started",
        version,
      });

      runInAction(() => {
        // TODO: Unacceptable damage caused by strict mode
        assert(version);
        assert(actualUpdateChannel);

        discoveredVersionState.set({
          version,
          updateChannel: actualUpdateChannel,
        });

        checkingForUpdatesState.set(false);
      });

      // Note: intentional orphan promise to make download happen in the background
      downloadUpdate().then(async ({ downloadWasSuccessful }) => {
        if (!downloadWasSuccessful) {
          broadcastChangeInUpdatingStatus({
            eventId: "download-for-update-failed",
          });

          return;
        }

        const userWantsToInstallUpdate = await askBoolean({
          id: "install-update",
          title: "Update Available",
          question: `Version ${version} of Lens IDE is available and ready to be installed. Would you like to update now?`,
        });

        if (userWantsToInstallUpdate) {
          quitAndInstallUpdate();
        }
      });
    };
  },
});

export default checkForUpdatesInjectable;