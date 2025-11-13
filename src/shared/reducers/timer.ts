import type { MachineReducer } from "@shared/types";
import { VendingMachineState, TimerState } from "@shared/states";
import { PAYMENT_TIMEOUT } from "@shared/constants";

// 타이머 모듈 리듀서
export const timerReducer: MachineReducer = (context, action, addLog) => {
  switch (action.type) {
    case "TIMER_START":
      return {
        ...context,
        timer: {
          ...context.timer,
          state: TimerState.RUNNING,
          startTime: Date.now(),
          duration: action.duration || PAYMENT_TIMEOUT,
        },
        eventLog: addLog("타이머 시작", "TIMER"),
      };

    case "TIMER_PAUSE":
      return {
        ...context,
        timer: {
          ...context.timer,
          state: TimerState.PAUSED,
        },
        eventLog: addLog("타이머 일시정지", "TIMER"),
      };

    case "TIMER_RESUME":
      return {
        ...context,
        timer: {
          ...context.timer,
          state: TimerState.RUNNING,
          startTime:
            Date.now() - (context.timer.duration - context.timer.remainingTime),
        },
        eventLog: addLog("타이머 재개", "TIMER"),
      };

    case "TIMER_EXPIRED":
      return {
        ...context,
        machineState: VendingMachineState.RETURNING_CHANGE,
        timer: {
          ...context.timer,
          state: TimerState.EXPIRED,
          remainingTime: 0,
        },
        message: `시간 초과. ${context.currentBalance}원을 반환합니다.`,
        eventLog: addLog(
          `⏰ 타임아웃 - ${context.currentBalance}원 반환`,
          "TIMER"
        ),
      };

    case "TIMER_RESET":
      return {
        ...context,
        timer: {
          state: TimerState.IDLE,
          startTime: null,
          duration: PAYMENT_TIMEOUT,
          remainingTime: 0,
        },
        eventLog: addLog("타이머 리셋", "TIMER"),
      };

    case "TIMER_UPDATE":
      return {
        ...context,
        timer: {
          ...context.timer,
          remainingTime: action.remainingTime,
        },
      };

    default:
      return null;
  }
};
