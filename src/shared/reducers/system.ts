import type { MachineReducer } from "../types";
import { VendingMachineState, ErrorCode } from "../states";
import { initialState } from "../constants";

// 시스템 관리 리듀서 (관리자 기능)
export const systemReducer: MachineReducer = (context, action, addLog) => {
  switch (action.type) {
    case "SET_OUT_OF_SERVICE":
      return {
        ...context,
        machineState: VendingMachineState.OUT_OF_SERVICE,
        errorCode: action.errorCode || ErrorCode.SYSTEM_ERROR,
        message: `고장 [${
          action.errorCode || ErrorCode.SYSTEM_ERROR
        }]: 관리자에게 문의하세요`,
        eventLog: addLog(`🔧 ${action.errorCode}: ${action.reason}`, "SYSTEM"),
      };

    case "RESET":
      return {
        ...initialState,
        inventorySensor: context.inventorySensor,
        changeReserve: context.changeReserve,
        eventLog: addLog("시스템 리셋", "SYSTEM"),
      };

    case "ADD_CHANGE_RESERVE_1000":
      return {
        ...context,
        changeReserve: {
          ...context.changeReserve,
          bills1000: context.changeReserve.bills1000 + action.amount,
        },
        eventLog: addLog(`거스름돈 충전: +${action.amount}장 (1000원)`, "SYSTEM"),
      };

    case "ADD_CHANGE_RESERVE_500":
      return {
        ...context,
        changeReserve: {
          ...context.changeReserve,
          coins500: context.changeReserve.coins500 + action.amount,
        },
        eventLog: addLog(`거스름돈 충전: +${action.amount}개 (500원)`, "SYSTEM"),
      };

    default:
      return null;
  }
};
