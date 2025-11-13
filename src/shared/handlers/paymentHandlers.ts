import type { Dispatch } from "react";
import type { VendingMachineAction } from "@shared/types";
import {
  BILL_INSERT_DELAY,
  BILL_VALIDATION_DELAY,
  BILL_ACCEPTANCE_THRESHOLD,
  BILL_REJECTION_RESET_DELAY,
  BILL_STACKING_DELAY,
  BILL_RESET_DELAY,
  COIN_INSERT_DELAY,
  COIN_VALIDATION_DELAY,
  COIN_ACCEPTANCE_THRESHOLD,
  COIN_REJECTION_RESET_DELAY,
  COIN_STORAGE_DELAY,
  COIN_RESET_DELAY,
} from "@shared/simulationConstants";

// 지폐 투입 시뮬레이션
export const createBillInsertHandler = (
  dispatch: Dispatch<VendingMachineAction>
) => {
  return (amount: number, isFake = false) => {
    dispatch({ type: "BILL_INSERT_START" });
    setTimeout(() => {
      dispatch({ type: "BILL_VALIDATING", amount });
      setTimeout(() => {
        // 가짜 지폐이거나 5% 확률로 거부
        if (isFake || Math.random() > BILL_ACCEPTANCE_THRESHOLD) {
          dispatch({ type: "BILL_REJECTED", reason: "가짜 지폐 의심" });
          setTimeout(() => {
            dispatch({ type: "BILL_VALIDATOR_RESET" });
          }, BILL_REJECTION_RESET_DELAY);
        } else {
          dispatch({ type: "BILL_ACCEPTED", amount });
          setTimeout(() => {
            dispatch({ type: "BILL_STACKED" });
            setTimeout(() => {
              dispatch({ type: "BILL_VALIDATOR_RESET" });
            }, BILL_RESET_DELAY);
          }, BILL_STACKING_DELAY);
        }
      }, BILL_VALIDATION_DELAY);
    }, BILL_INSERT_DELAY);
  };
};

// 동전 투입 시뮬레이션
export const createCoinInsertHandler = (
  dispatch: Dispatch<VendingMachineAction>
) => {
  return (amount: number, isFake = false) => {
    dispatch({ type: "COIN_INSERT_START" });
    setTimeout(() => {
      dispatch({ type: "COIN_VALIDATING", amount });
      setTimeout(() => {
        // 가짜 동전이거나 3% 확률로 거부
        if (isFake || Math.random() > COIN_ACCEPTANCE_THRESHOLD) {
          dispatch({ type: "COIN_REJECTED", reason: "무게/크기 불일치" });
          setTimeout(() => {
            dispatch({ type: "COIN_VALIDATOR_RESET" });
          }, COIN_REJECTION_RESET_DELAY);
        } else {
          dispatch({ type: "COIN_ACCEPTED", amount });
          setTimeout(() => {
            dispatch({ type: "COIN_STORED" });
            setTimeout(() => {
              dispatch({ type: "COIN_VALIDATOR_RESET" });
            }, COIN_RESET_DELAY);
          }, COIN_STORAGE_DELAY);
        }
      }, COIN_VALIDATION_DELAY);
    }, COIN_INSERT_DELAY);
  };
};

// 카드 삽입
export const createCardInsertHandler = (
  dispatch: Dispatch<VendingMachineAction>
) => {
  return () => {
    dispatch({ type: "CARD_INSERT" });
  };
};
