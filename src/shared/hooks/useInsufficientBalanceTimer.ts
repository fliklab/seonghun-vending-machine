import { useEffect, useRef, type Dispatch } from "react";
import { INSUFFICIENT_BALANCE_WAIT } from "@shared/constants";
import type { VendingMachineAction } from "@shared/types";

export const useInsufficientBalanceTimer = (
  insufficientBalanceTime: number | null,
  dispatch: Dispatch<VendingMachineAction>
) => {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (insufficientBalanceTime) {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        dispatch({ type: "INSUFFICIENT_BALANCE_RESET" });
      }, INSUFFICIENT_BALANCE_WAIT);
    }

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [insufficientBalanceTime, dispatch]);
};
