import { useEffect, type Dispatch } from "react";
import { TimerState } from "@shared/states";
import type { TimerModule, VendingMachineAction } from "@shared/types";
import { TIMER_UPDATE_INTERVAL } from "@shared/simulationConstants";

export const useTimerEffect = (
  timer: TimerModule,
  dispatch: Dispatch<VendingMachineAction>
) => {
  useEffect(() => {
    if (timer.state === TimerState.RUNNING && timer.startTime) {
      const startTime = timer.startTime;
      const interval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, timer.duration - elapsed);

        dispatch({ type: "TIMER_UPDATE", remainingTime: remaining });

        if (remaining === 0) {
          dispatch({ type: "TIMER_EXPIRED" });
          clearInterval(interval);
        }
      }, TIMER_UPDATE_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [timer.state, timer.startTime, timer.duration, dispatch]);
};
