import type { MachineReducer } from "@shared/types";
import { ChangeDispenserState } from "@shared/states";

// 거스름돈 반환기 리듀서
export const changeDispenserReducer: MachineReducer = (context, action, addLog) => {
  switch (action.type) {
    case "START_CHANGE_DISPENSING":
      return {
        ...context,
        changeDispenser: {
          state: ChangeDispenserState.CALCULATING,
          remainingChange: action.amount,
          dispensedCoins: [],
          dispensedBills: [],
        },
        eventLog: addLog(`💰 거스름돈 계산 중: ${action.amount}원`, "CHANGE"),
      };

    case "DISPENSE_CHANGE_BILL":
      return {
        ...context,
        changeReserve: {
          ...context.changeReserve,
          bills1000: context.changeReserve.bills1000 - 1,  // 1000원 지폐 1장 차감
        },
        changeDispenser: {
          ...context.changeDispenser,
          state: ChangeDispenserState.DISPENSING,
          remainingChange:
            context.changeDispenser.remainingChange - action.amount,
          dispensedBills: [
            ...context.changeDispenser.dispensedBills,
            action.amount,
          ],
        },
        eventLog: addLog(`💵 ${action.amount}원 지폐 반환 (재고: ${context.changeReserve.bills1000 - 1}장)`, "CHANGE"),
      };

    case "DISPENSE_CHANGE_COIN":
      return {
        ...context,
        changeReserve: {
          ...context.changeReserve,
          coins500: context.changeReserve.coins500 - 1,  // 500원 동전 1개 차감
        },
        changeDispenser: {
          ...context.changeDispenser,
          state: ChangeDispenserState.DISPENSING,
          remainingChange:
            context.changeDispenser.remainingChange - action.amount,
          dispensedCoins: [
            ...context.changeDispenser.dispensedCoins,
            action.amount,
          ],
        },
        eventLog: addLog(`🪙 ${action.amount}원 동전 반환 (재고: ${context.changeReserve.coins500 - 1}개)`, "CHANGE"),
      };

    case "CHANGE_DISPENSING_COMPLETE":
      return {
        ...context,
        changeDispenser: {
          state: ChangeDispenserState.COMPLETED,
          remainingChange: 0,
          dispensedCoins: context.changeDispenser.dispensedCoins,
          dispensedBills: context.changeDispenser.dispensedBills,
        },
        eventLog: addLog(`✅ 거스름돈 반환 완료`, "CHANGE"),
      };

    case "CHANGE_DISPENSER_RESET":
      return {
        ...context,
        changeDispenser: {
          state: ChangeDispenserState.IDLE,
          remainingChange: 0,
          dispensedCoins: [],
          dispensedBills: [],
        },
      };

    default:
      return null;
  }
};
