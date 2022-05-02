/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getStartableStoppable } from "./get-startable-stoppable";

describe("getStartableStoppable", () => {
  let stopMock: jest.Mock<() => void>;
  let startMock: jest.Mock<() => () => void>;
  let actual: { stop: () => void; start: () => void; started: boolean };

  beforeEach(() => {
    stopMock = jest.fn();
    startMock = jest.fn(() => stopMock);

    actual = getStartableStoppable("some-id", startMock);
  });

  it("does not start yet", () => {
    expect(startMock).not.toHaveBeenCalled();
  });

  it("does not stop yet", () => {
    expect(stopMock).not.toHaveBeenCalled();
  });

  it("when stopping before ever starting, throws", () => {
    expect(() => {
      actual.stop();
    }).toThrow("Tried to stop \"some-id\", but it has not started yet.");
  });

  it("is not started", () => {
    expect(actual.started).toBe(false);
  });

  describe("when started", () => {
    beforeEach(() => {
      actual.start();
    });

    it("starts", () => {
      expect(startMock).toHaveBeenCalled();
    });

    it("is started", () => {
      expect(actual.started).toBe(true);
    });

    it("when started again, throws", () => {
      expect(() => {
        actual.start();
      }).toThrow("Tried to start \"some-id\", but it has already started.");
    });

    it("does not stop yet", () => {
      expect(stopMock).not.toHaveBeenCalled();
    });

    describe("when stopped", () => {
      beforeEach(() => {
        actual.stop();
      });

      it("stops", () => {
        expect(stopMock).toHaveBeenCalled();
      });

      it("is not started", () => {
        expect(actual.started).toBe(false);
      });

      it("when stopped again, throws", () => {
        expect(() => {
          actual.stop();
        }).toThrow("Tried to stop \"some-id\", but it has already stopped.");
      });

      describe("when started again", () => {
        beforeEach(() => {
          startMock.mockClear();

          actual.start();
        });

        it("starts", () => {
          expect(startMock).toHaveBeenCalled();
        });

        it("is started", () => {
          expect(actual.started).toBe(true);
        });

        it("when stopped, stops", () => {
          stopMock.mockClear();

          actual.stop();

          expect(stopMock).toHaveBeenCalled();
        });
      });
    });
  });
});