import { VendingMachineState } from "@shared/states";
import type { VendingMachineStateValue } from "@shared/types";

export const getStateColor = (
  currentState: VendingMachineStateValue
): string => {
  const colors: Record<VendingMachineStateValue, string> = {
    [VendingMachineState.IDLE]: "bg-gray-500",
    [VendingMachineState.PAYMENT_IN_PROGRESS]: "bg-blue-500",
    [VendingMachineState.ITEM_SELECTED]: "bg-yellow-500",
    [VendingMachineState.DISPENSING]: "bg-green-500",
    [VendingMachineState.RETURNING_CHANGE]: "bg-purple-500",
    [VendingMachineState.ERROR]: "bg-red-500",
    [VendingMachineState.OUT_OF_SERVICE]: "bg-red-700",
  };
  return colors[currentState] ?? "bg-gray-500";
};

export const getStateText = (currentState: VendingMachineStateValue): string => {
  const texts: Record<VendingMachineStateValue, string> = {
    [VendingMachineState.IDLE]: "대기",
    [VendingMachineState.PAYMENT_IN_PROGRESS]: "결제 진행중",
    [VendingMachineState.ITEM_SELECTED]: "음료 선택됨",
    [VendingMachineState.DISPENSING]: "배출중",
    [VendingMachineState.RETURNING_CHANGE]: "거스름돈 반환",
    [VendingMachineState.ERROR]: "오류",
    [VendingMachineState.OUT_OF_SERVICE]: "고장",
  };
  return texts[currentState] ?? currentState;
};

export const calculateRemainingSeconds = (remainingTime: number): number => {
  return remainingTime > 0 ? Math.ceil(remainingTime / 1000) : 0;
};
