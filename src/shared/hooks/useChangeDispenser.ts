import { useEffect, type Dispatch } from "react";
import {
  ChangeDispenserState,
  VendingMachineState,
} from "@shared/states";
import type {
  ChangeDispenser,
  VendingMachineAction,
  VendingMachineStateValue,
} from "@shared/types";
import {
  CHANGE_START_DELAY,
  CHANGE_ITEM_INTERVAL,
  CHANGE_COMPLETE_DELAY,
  NO_CHANGE_DELAY,
} from "@shared/simulationConstants";

export const useChangeDispenser = (
  machineState: VendingMachineStateValue,
  changeDispenser: ChangeDispenser,
  currentBalance: number,
  isProcessing: boolean,
  dispatch: Dispatch<VendingMachineAction>
) => {
  useEffect(() => {
    if (
      machineState === VendingMachineState.RETURNING_CHANGE &&
      changeDispenser.state === ChangeDispenserState.IDLE &&
      !isProcessing
    ) {
      const changeAmount = currentBalance;
      if (changeAmount > 0) {
        dispatch({ type: "START_CHANGE_DISPENSING", amount: changeAmount });

        // 거스름돈을 1000원, 500원 단위로 분해하여 순차 반환
        let remaining = changeAmount;
        const bills = [];
        const coins = [];

        // 1000원 지폐
        while (remaining >= 1000) {
          bills.push(1000);
          remaining -= 1000;
        }

        // 500원 동전
        while (remaining >= 500) {
          coins.push(500);
          remaining -= 500;
        }

        // 순차적으로 반환
        let delay = CHANGE_START_DELAY;
        bills.forEach((bill) => {
          setTimeout(() => {
            dispatch({ type: "DISPENSE_CHANGE_BILL", amount: bill });
          }, delay);
          delay += CHANGE_ITEM_INTERVAL;
        });

        coins.forEach((coin) => {
          setTimeout(() => {
            dispatch({ type: "DISPENSE_CHANGE_COIN", amount: coin });
          }, delay);
          delay += CHANGE_ITEM_INTERVAL;
        });

        // 모든 반환 완료 후
        setTimeout(() => {
          dispatch({ type: "CHANGE_DISPENSING_COMPLETE" });
          setTimeout(() => {
            dispatch({ type: "CHANGE_DISPENSER_RESET" });
            dispatch({ type: "RETURN_CHANGE_COMPLETE" });
          }, CHANGE_COMPLETE_DELAY);
        }, delay);
      } else {
        // 거스름돈이 없으면 바로 완료
        setTimeout(() => {
          dispatch({ type: "RETURN_CHANGE_COMPLETE" });
        }, NO_CHANGE_DELAY);
      }
    }
  }, [
    machineState,
    changeDispenser.state,
    currentBalance,
    isProcessing,
    dispatch,
  ]);
};
