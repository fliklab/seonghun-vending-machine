import { Package } from "lucide-react";
import type { Dispatch } from "react";
import { DRINKS } from "@shared/constants";
import {
  ChangeDispenserState,
  VendingMachineState,
} from "@shared/states";
import type {
  ChangeDispenser,
  InventoryRecord,
  VendingMachineAction,
  VendingMachineStateValue,
} from "@shared/types";

interface DrinkSelectionProps {
  machineState: VendingMachineStateValue;
  inventory: InventoryRecord;
  selectedButtonId: string | null;
  selectedItemId: string | null;
  changeDispenser: ChangeDispenser;
  isProcessing: boolean;
  dispatch: Dispatch<VendingMachineAction>;
}

export const DrinkSelection = ({
  machineState,
  inventory,
  selectedButtonId,
  selectedItemId,
  changeDispenser,
  isProcessing,
  dispatch,
}: DrinkSelectionProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border-2 border-slate-700">
      <h3 className="text-white font-bold mb-4 text-xl flex items-center gap-2">
        <Package className="w-6 h-6" />
        음료 선택
      </h3>
      <div className="space-y-3">
        {DRINKS.map((drink) => {
          const stock = inventory[drink.id] ?? 0;
          const isOutOfStock = stock <= 0;
          const isSelected = selectedButtonId === drink.id;
          const isActive =
            selectedItemId === drink.id &&
            (machineState === VendingMachineState.ITEM_SELECTED ||
              machineState === VendingMachineState.DISPENSING);

          return (
            <div key={drink.id} className="flex items-center gap-3">
              {/* 메뉴 정보 */}
              <div
                className={`
                  flex-1 ${
                    isOutOfStock
                      ? "bg-gray-700 opacity-50"
                      : "bg-gradient-to-r from-blue-600 to-purple-600"
                  }
                  text-white p-3 rounded-lg flex items-center justify-between
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🥤</div>
                  <div>
                    <div className="font-bold">{drink.name}</div>
                    <div className="text-sm">
                      {drink.price.toLocaleString()}원
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xs ${
                      stock <= 3 && stock > 0
                        ? "text-yellow-300"
                        : "text-slate-300"
                    }`}
                  >
                    재고: {stock}개
                  </div>
                  {isOutOfStock && (
                    <div className="text-red-400 font-bold text-xs mt-1">
                      품절
                    </div>
                  )}
                </div>
              </div>

              {/* 선택 버튼 */}
              <button
                onClick={() => {
                  dispatch({
                    type: "INVENTORY_CHECK_START",
                    itemId: drink.id,
                  });
                  setTimeout(() => {
                    if (stock > 0) {
                      dispatch({
                        type: "INVENTORY_AVAILABLE",
                        itemName: drink.name,
                      });
                      dispatch({
                        type: "SELECT_ITEM",
                        itemId: drink.id,
                      });
                    } else {
                      dispatch({
                        type: "INVENTORY_OUT_OF_STOCK",
                        itemName: drink.name,
                      });
                    }
                  }, 300);
                }}
                disabled={
                  isOutOfStock ||
                  machineState === VendingMachineState.OUT_OF_SERVICE ||
                  machineState === VendingMachineState.DISPENSING ||
                  machineState === VendingMachineState.RETURNING_CHANGE ||
                  changeDispenser.state === ChangeDispenserState.DISPENSING ||
                  isProcessing
                }
                className={`
                  ${
                    isActive
                      ? "bg-yellow-500 ring-4 ring-yellow-300 shadow-lg shadow-yellow-500/50"
                      : isSelected
                      ? "bg-green-600 ring-2 ring-green-400"
                      : "bg-slate-700 hover:bg-slate-600"
                  }
                  ${isOutOfStock ? "opacity-30 cursor-not-allowed" : ""}
                  disabled:cursor-not-allowed disabled:opacity-50
                  text-white px-6 py-4 rounded-lg font-bold text-3xl
                  transition-all duration-200 relative min-w-[80px]
                  ${isActive ? "animate-pulse" : ""}
                `}
              >
                {drink.id}
                {isActive && (
                  <div className="absolute -top-1 -right-1 flex gap-1">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-75"></div>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-700 rounded"></div>
            <span>기본 상태</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded ring-2 ring-green-400"></div>
            <span>선택됨</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded animate-pulse"></div>
            <span>처리중 (배출~반환)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
