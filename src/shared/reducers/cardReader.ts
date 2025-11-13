import type { MachineReducer } from "../types";
import {
  VendingMachineState,
  CardReaderState,
  TimerState,
  PaymentMethod,
  ErrorCode,
} from "../states";

// 카드 리더기 리듀서
export const cardReaderReducer: MachineReducer = (context, action, addLog) => {
  switch (action.type) {
    case "CARD_INSERT":
      return {
        ...context,
        machineState: VendingMachineState.PAYMENT_IN_PROGRESS,
        paymentMethod: PaymentMethod.CARD,
        cardReader: {
          ...context.cardReader,
          state: CardReaderState.CARD_DETECTED,
          isCardInserted: true,
        },
        timer: {
          ...context.timer,
          state: TimerState.RUNNING,
          startTime: Date.now(),
        },
        message: "카드가 인식되었습니다. 음료를 선택하세요.",
        eventLog: addLog("카드 삽입 감지", "CARD"),
      };

    case "CARD_READING":
      return {
        ...context,
        cardReader: {
          ...context.cardReader,
          state: CardReaderState.READING,
        },
        eventLog: addLog("카드 정보 읽는 중...", "CARD"),
      };

    case "CARD_PROCESSING":
      return {
        ...context,
        cardReader: {
          ...context.cardReader,
          state: CardReaderState.PROCESSING,
          lastTransactionAmount: action.amount,
        },
        eventLog: addLog(`${action.amount}원 결제 처리 중...`, "CARD"),
      };

    case "CARD_APPROVED":
      return {
        ...context,
        machineState: VendingMachineState.DISPENSING,
        cardReader: {
          ...context.cardReader,
          state: CardReaderState.APPROVED,
        },
        message: "카드 결제 승인! 음료를 배출합니다...",
        eventLog: addLog(`✅ ${action.amount}원 결제 승인`, "CARD"),
      };

    case "CARD_DECLINED":
      return {
        ...context,
        machineState: VendingMachineState.PAYMENT_IN_PROGRESS,
        cardReader: {
          ...context.cardReader,
          state: CardReaderState.DECLINED,
        },
        selectedItem: null,
        selectedButtonId: null,
        errorCode: ErrorCode.CARD_READER_ERROR,
        message: `카드 결제 거부: ${action.reason}`,
        eventLog: addLog(`❌ 결제 거부: ${action.reason}`, "CARD"),
      };

    case "CARD_REMOVE":
      return {
        ...context,
        cardReader: {
          state: CardReaderState.IDLE,
          isCardInserted: false,
          lastTransactionAmount: 0,
        },
        paymentMethod:
          context.currentBalance > 0 ? PaymentMethod.CASH : PaymentMethod.NONE,
        machineState:
          context.currentBalance > 0
            ? VendingMachineState.PAYMENT_IN_PROGRESS
            : VendingMachineState.IDLE,
        message:
          context.currentBalance > 0
            ? `카드 제거됨. 현재 잔액: ${context.currentBalance}원`
            : "카드가 제거되었습니다.",
        eventLog: addLog("카드 제거됨", "CARD"),
      };

    default:
      return null;
  }
};
