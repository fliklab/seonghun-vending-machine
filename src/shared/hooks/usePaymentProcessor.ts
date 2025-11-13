import { useEffect, type Dispatch } from "react";
import { PaymentMethod, VendingMachineState } from "@shared/states";
import type {
  Drink,
  PaymentMethodValue,
  VendingMachineAction,
  VendingMachineStateValue,
} from "@shared/types";
import {
  CARD_READING_DELAY,
  CARD_PROCESSING_DELAY,
  CARD_DECLINE_THRESHOLD,
  DISPENSER_START_DELAY,
  DISPENSER_OPERATION_DELAY,
  DISPENSER_JAM_THRESHOLD,
  DISPENSER_RESET_DELAY,
} from "@shared/simulationConstants";

export const usePaymentProcessor = (
  machineState: VendingMachineStateValue,
  paymentMethod: PaymentMethodValue,
  selectedItem: Drink | null,
  isProcessing: boolean,
  setIsProcessing: (value: boolean) => void,
  dispatch: Dispatch<VendingMachineAction>
) => {
  useEffect(() => {
    if (machineState === VendingMachineState.ITEM_SELECTED && !isProcessing) {
      setIsProcessing(true);

      if (!selectedItem) {
        setIsProcessing(false);
        return;
      }

      // 재고 감소
      dispatch({
        type: "INVENTORY_DECREASE",
        itemId: selectedItem.id,
        itemName: selectedItem.name,
      });

      if (paymentMethod === PaymentMethod.CARD) {
        // 카드 결제 처리
        dispatch({ type: "CARD_READING" });
        setTimeout(() => {
          dispatch({
            type: "CARD_PROCESSING",
            amount: selectedItem.price,
          });
          setTimeout(() => {
            // 85% 확률로 승인
            if (Math.random() > CARD_DECLINE_THRESHOLD) {
              dispatch({
                type: "CARD_APPROVED",
                amount: selectedItem.price,
              });
              setTimeout(() => {
                dispatch({ type: "DISPENSER_START", item: selectedItem });
                setTimeout(() => {
                  // 95% 확률로 배출 성공
                  if (Math.random() > DISPENSER_JAM_THRESHOLD) {
                    dispatch({ type: "DISPENSER_COMPLETED" });
                    setTimeout(() => {
                      dispatch({ type: "DISPENSER_RESET" });
                    }, DISPENSER_RESET_DELAY);
                  } else {
                    dispatch({ type: "DISPENSER_JAMMED" });
                  }
                  setIsProcessing(false);
                }, DISPENSER_OPERATION_DELAY);
              }, DISPENSER_START_DELAY);
            } else {
              dispatch({
                type: "CARD_DECLINED",
                reason: "잔액 부족 또는 승인 거부",
              });
              setIsProcessing(false);
            }
          }, CARD_PROCESSING_DELAY);
        }, CARD_READING_DELAY);
      } else {
        // 현금 결제 (즉시 승인)
        setTimeout(() => {
          dispatch({ type: "DISPENSER_START", item: selectedItem });
          setTimeout(() => {
            if (Math.random() > DISPENSER_JAM_THRESHOLD) {
              dispatch({ type: "DISPENSER_COMPLETED" });
              setTimeout(() => {
                dispatch({ type: "DISPENSER_RESET" });
              }, DISPENSER_RESET_DELAY);
            } else {
              dispatch({ type: "DISPENSER_JAMMED" });
            }
            setIsProcessing(false);
          }, DISPENSER_OPERATION_DELAY);
        }, DISPENSER_START_DELAY);
      }
    }
  }, [
    machineState,
    paymentMethod,
    selectedItem,
    isProcessing,
    setIsProcessing,
    dispatch,
  ]);
};
