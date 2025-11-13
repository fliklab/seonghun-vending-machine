import type { MachineReducer } from "../types";
import {
  VendingMachineState,
  TimerState,
  PaymentMethod,
  ErrorCode,
} from "../states";
import { PAYMENT_TIMEOUT } from "../constants";

// 거래 완료 및 취소 리듀서
export const transactionReducer: MachineReducer = (context, action, addLog) => {
  switch (action.type) {
    case "RETURN_CHANGE_COMPLETE":
      return {
        ...context,
        machineState: VendingMachineState.IDLE,
        currentBalance: 0,
        selectedItem: null,
        selectedButtonId: null,
        paymentMethod: context.cardReader.isCardInserted
          ? PaymentMethod.CARD
          : PaymentMethod.NONE,
        timer: {
          state: TimerState.IDLE,
          startTime: null,
          duration: PAYMENT_TIMEOUT,
          remainingTime: 0,
        },
        message: context.cardReader.isCardInserted
          ? "거스름돈 반환 완료. 카드로 다시 선택하세요."
          : "음료를 선택하거나 금액을 투입하세요",
        errorCode: ErrorCode.NONE,
        eventLog: addLog("💰 거래 완료", "TRANSACTION"),
      };

    case "CANCEL":
      const refundAmount = context.currentBalance;
      return {
        ...context,
        machineState:
          refundAmount > 0
            ? VendingMachineState.RETURNING_CHANGE
            : VendingMachineState.IDLE,
        selectedItem: null,
        selectedButtonId: null,
        timer: {
          state: TimerState.IDLE,
          startTime: null,
          duration: PAYMENT_TIMEOUT,
          remainingTime: 0,
        },
        insufficientBalanceTime: null,
        message:
          refundAmount > 0
            ? `취소되었습니다. ${refundAmount}원을 반환합니다.`
            : "취소되었습니다.",
        errorCode: ErrorCode.NONE,
        eventLog: addLog(`🔙 취소 - ${refundAmount}원 반환`, "TRANSACTION"),
      };

    default:
      return null;
  }
};
