import type {
  VendingMachineContext,
  VendingMachineAction,
  AddLog,
} from "@shared/types";
import {
  VendingMachineState,
  BillValidatorState,
  CoinValidatorState,
  CardReaderState,
} from "@shared/states";
import { initialState } from "@shared/constants";
import { billValidatorReducer } from "./billValidator";
import { coinValidatorReducer } from "./coinValidator";
import { cardReaderReducer } from "./cardReader";
import { timerReducer } from "./timer";
import { inventorySensorReducer } from "./inventory";
import { dispenserReducer } from "./dispenser";
import { changeDispenserReducer } from "./changeDispenser";
import { paymentReducer } from "./payment";
import { transactionReducer } from "./transaction";
import { systemReducer } from "./system";

// ===== 메인 리듀서 (라우터) =====
export function vendingMachineReducer(
  state: VendingMachineContext,
  action: VendingMachineAction
): VendingMachineContext {
  const addLog: AddLog = (message, module = "MAIN") => {
    const timestamp = new Date().toLocaleTimeString("ko-KR");
    return [...state.eventLog, { time: timestamp, module, message }].slice(-20);
  };

  // 카드/현금 충돌 처리 (입력 모듈 공통 로직)
  if (
    action.type === "BILL_INSERT_START" ||
    action.type === "COIN_INSERT_START"
  ) {
    if (state.machineState === VendingMachineState.OUT_OF_SERVICE) {
      return state;
    }

    // 카드 삽입 중이면 취소하고 현금 반환 후 재시작
    if (state.cardReader.isCardInserted) {
      return {
        ...initialState,
        inventorySensor: state.inventorySensor,
        changeReserve: state.changeReserve,
        machineState: VendingMachineState.RETURNING_CHANGE,
        currentBalance: state.currentBalance,
        [action.type === "BILL_INSERT_START"
          ? "billValidator"
          : "coinValidator"]: {
          ...state[
            action.type === "BILL_INSERT_START"
              ? "billValidator"
              : "coinValidator"
          ],
          state:
            action.type === "BILL_INSERT_START"
              ? BillValidatorState.DETECTING
              : CoinValidatorState.DETECTING,
        },
        eventLog: addLog(
          `현금 반환 후 ${
            action.type === "BILL_INSERT_START" ? "지폐" : "동전"
          } 감지 시작`,
          action.type === "BILL_INSERT_START" ? "BILL" : "COIN"
        ),
      };
    }
  }

  if (action.type === "CARD_INSERT") {
    if (state.machineState === VendingMachineState.OUT_OF_SERVICE) {
      return state;
    }

    // 현금이 있으면 반환하고 재시작
    if (state.currentBalance > 0) {
      return {
        ...initialState,
        inventorySensor: state.inventorySensor,
        changeReserve: state.changeReserve,
        machineState: VendingMachineState.RETURNING_CHANGE,
        currentBalance: state.currentBalance,
        cardReader: {
          state: CardReaderState.CARD_DETECTED,
          isCardInserted: false,
          lastTransactionAmount: 0,
        },
        eventLog: addLog(
          `현금 ${state.currentBalance}원 반환 후 카드 감지`,
          "CARD"
        ),
      };
    }
  }

  // 각 모듈별 리듀서에 위임
  let result: VendingMachineContext | null;

  // 입력 모듈
  result = billValidatorReducer(state, action, addLog);
  if (result) return result;

  result = coinValidatorReducer(state, action, addLog);
  if (result) return result;

  result = cardReaderReducer(state, action, addLog);
  if (result) return result;

  // 제어 모듈
  result = timerReducer(state, action, addLog);
  if (result) return result;

  result = paymentReducer(state, action, addLog);
  if (result) return result;

  result = transactionReducer(state, action, addLog);
  if (result) return result;

  // 출력 모듈
  result = inventorySensorReducer(state, action, addLog);
  if (result) return result;

  result = dispenserReducer(state, action, addLog);
  if (result) return result;

  result = changeDispenserReducer(state, action, addLog);
  if (result) return result;

  // 시스템 관리
  result = systemReducer(state, action, addLog);
  if (result) return result;

  // 처리되지 않은 액션
  return state;
}
