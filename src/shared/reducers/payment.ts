import type { MachineReducer } from "../types";
import {
  VendingMachineState,
  InventorySensorState,
  PaymentMethod,
  ErrorCode,
} from "../states";
import { DRINKS } from "../constants";

// 결제 처리 리듀서 (음료 선택 및 검증)
export const paymentReducer: MachineReducer = (context, action, addLog) => {
  switch (action.type) {
    case "SELECT_ITEM":
      const drink = DRINKS.find((d) => d.id === action.itemId);
      if (!drink) {
        return context;
      }

      const stock = context.inventorySensor.inventory[action.itemId] ?? 0;

      // 재고 확인
      if (stock <= 0) {
        return {
          ...context,
          inventorySensor: {
            ...context.inventorySensor,
            state: InventorySensorState.OUT_OF_STOCK,
          },
          message: `${drink.name}은(는) 품절입니다.`,
          eventLog: addLog(`❌ ${drink.name} 품절`, "PAYMENT"),
        };
      }

      // 카드 결제
      if (context.paymentMethod === PaymentMethod.CARD) {
        return {
          ...context,
          selectedItem: drink,
          selectedButtonId: action.itemId,
          machineState: VendingMachineState.ITEM_SELECTED,
          inventorySensor: {
            ...context.inventorySensor,
            state: InventorySensorState.AVAILABLE,
          },
          message: `${drink.name} 선택됨. 카드 결제를 진행합니다...`,
          eventLog: addLog(`🥤 ${drink.name} 선택 (카드)`, "PAYMENT"),
        };
      }

      // 현금 결제 - 금액 확인
      if (context.currentBalance < drink.price) {
        return {
          ...context,
          message: `금액이 부족합니다. ${
            drink.price - context.currentBalance
          }원이 더 필요합니다.`,
          insufficientBalanceTime: Date.now(),
          eventLog: addLog(`❌ 금액 부족`, "PAYMENT"),
        };
      }

      // 거스름돈 확인 (1000원, 500원으로 거슬러 줄 수 있는지 체크)
      const requiredChange = context.currentBalance - drink.price;
      if (requiredChange > 0) {
        // 필요한 1000원과 500원 개수 계산
        const needed1000 = Math.floor(requiredChange / 1000);
        const remaining = requiredChange % 1000;
        const needed500 = Math.ceil(remaining / 500);

        // 잔돈 재고 확인
        const available1000 = context.changeReserve.bills1000;
        const available500 = context.changeReserve.coins500;

        // 잔돈 부족 체크
        if (needed1000 > available1000 || needed500 > available500) {
          return {
            ...context,
            machineState: VendingMachineState.OUT_OF_SERVICE,
            errorCode: ErrorCode.INSUFFICIENT_CHANGE,
            message: "거스름돈이 부족합니다. 관리자에게 문의하세요.",
            eventLog: addLog(
              `🔧 ${ErrorCode.INSUFFICIENT_CHANGE}: 거스름돈 부족 (필요: ${needed1000}x1000원, ${needed500}x500원 / 보유: ${available1000}x1000원, ${available500}x500원)`,
              "PAYMENT"
            ),
          };
        }
      }

      return {
        ...context,
        selectedItem: drink,
        selectedButtonId: action.itemId,
        machineState: VendingMachineState.ITEM_SELECTED,
        inventorySensor: {
          ...context.inventorySensor,
          state: InventorySensorState.AVAILABLE,
        },
        message: `${drink.name} 선택됨. 결제를 진행합니다...`,
        eventLog: addLog(`🥤 ${drink.name} 선택 (${drink.price}원)`, "PAYMENT"),
      };

    case "INSUFFICIENT_BALANCE_RESET":
      return {
        ...context,
        insufficientBalanceTime: null,
        message:
          context.currentBalance > 0
            ? `현재 잔액: ${context.currentBalance}원`
            : "음료를 선택하거나 금액을 투입하세요",
        eventLog: addLog("금액 부족 메시지 초기화", "PAYMENT"),
      };

    default:
      return null;
  }
};
