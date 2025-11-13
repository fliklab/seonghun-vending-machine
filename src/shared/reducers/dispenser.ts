import type { MachineReducer } from "@shared/types";
import {
  VendingMachineState,
  DispenserState,
  PaymentMethod,
  ErrorCode,
} from "@shared/states";

// 배출기 리듀서
export const dispenserReducer: MachineReducer = (context, action, addLog) => {
  switch (action.type) {
    case "DISPENSER_START":
      return {
        ...context,
        dispenser: {
          ...context.dispenser,
          state: DispenserState.DISPENSING,
          lastDispensedItem: action.item,
        },
        eventLog: addLog(`${action.item.name} 배출 시작`, "DISPENSER"),
      };

    case "DISPENSER_COMPLETED":
      const selectedPrice = context.selectedItem?.price ?? 0;
      const change =
        context.paymentMethod === PaymentMethod.CARD
          ? 0
          : Math.max(0, context.currentBalance - selectedPrice);

      return {
        ...context,
        machineState:
          change > 0
            ? VendingMachineState.RETURNING_CHANGE
            : VendingMachineState.IDLE,
        currentBalance: change,
        dispenser: {
          ...context.dispenser,
          state: DispenserState.COMPLETED,
        },
        message:
          change > 0
            ? `음료 배출 완료! 거스름돈 ${change}원을 반환합니다.`
            : "음료 배출 완료!",
        eventLog: addLog(
          `✅ ${context.selectedItem?.name ?? "음료"} 배출 완료`,
          "DISPENSER"
        ),
      };

    case "DISPENSER_JAMMED":
      return {
        ...context,
        machineState: VendingMachineState.ERROR,
        errorCode: ErrorCode.DISPENSE_FAILURE,
        dispenser: {
          ...context.dispenser,
          state: DispenserState.JAMMED,
        },
        message: "배출 실패: 음료가 걸렸습니다. 관리자에게 문의하세요.",
        eventLog: addLog(`🔧 배출 실패: 걸림 현상`, "DISPENSER"),
      };

    case "DISPENSER_RESET":
      return {
        ...context,
        dispenser: {
          state: DispenserState.IDLE,
          lastDispensedItem: null,
        },
      };

    default:
      return null;
  }
};
