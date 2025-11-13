import type { MachineReducer } from "@shared/types";
import { InventorySensorState } from "@shared/states";

// 재고 센서 리듀서
export const inventorySensorReducer: MachineReducer = (context, action, addLog) => {
  switch (action.type) {
    case "INVENTORY_CHECK_START":
      return {
        ...context,
        inventorySensor: {
          ...context.inventorySensor,
          state: InventorySensorState.CHECKING,
        },
        eventLog: addLog(`재고 확인 중: ${action.itemId}`, "INVENTORY"),
      };

    case "INVENTORY_AVAILABLE":
      return {
        ...context,
        inventorySensor: {
          ...context.inventorySensor,
          state: InventorySensorState.AVAILABLE,
        },
        eventLog: addLog(`✅ 재고 확인 완료: ${action.itemName}`, "INVENTORY"),
      };

    case "INVENTORY_OUT_OF_STOCK":
      return {
        ...context,
        inventorySensor: {
          ...context.inventorySensor,
          state: InventorySensorState.OUT_OF_STOCK,
        },
        message: `${action.itemName}은(는) 품절입니다.`,
        eventLog: addLog(`❌ 품절: ${action.itemName}`, "INVENTORY"),
      };

    case "INVENTORY_DECREASE": {
      const currentCount =
        context.inventorySensor.inventory[action.itemId] ?? 0;
      const newInventory = {
        ...context.inventorySensor.inventory,
        [action.itemId]: Math.max(0, currentCount - 1),
      };
      return {
        ...context,
        inventorySensor: {
          ...context.inventorySensor,
          inventory: newInventory,
        },
        eventLog: addLog(`재고 차감: ${action.itemName}`, "INVENTORY"),
      };
    }

    case "INVENTORY_RESTOCK": {
      const currentCount =
        context.inventorySensor.inventory[action.itemId] ?? 0;
      const restockedInventory = {
        ...context.inventorySensor.inventory,
        [action.itemId]: currentCount + (action.amount ?? 0),
      };
      return {
        ...context,
        inventorySensor: {
          ...context.inventorySensor,
          inventory: restockedInventory,
          state: InventorySensorState.IDLE,
        },
        eventLog: addLog(
          `재고 보충: ${action.itemName} +${action.amount}`,
          "INVENTORY"
        ),
      };
    }

    default:
      return null;
  }
};
