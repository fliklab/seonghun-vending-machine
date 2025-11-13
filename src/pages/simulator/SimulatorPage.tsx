import {
  Activity,
  AlertCircle,
  Clock,
  Coins,
  Cpu,
  CreditCard,
  DollarSign,
  Package,
} from "lucide-react";
import { useReducer, useState, useMemo } from "react";
import { ModuleStatusPanel } from "./components/ModuleStatusPanel";

import { DRINKS, initialState } from "@shared/constants";
import { vendingMachineReducer } from "@shared/reducers";
import {
  BillValidatorState,
  CardReaderState,
  ChangeDispenserState,
  CoinValidatorState,
  DispenserState,
  ErrorCode,
  TimerState,
  VendingMachineState,
} from "@shared/states";
import {
  createBillInsertHandler,
  createCoinInsertHandler,
  createCardInsertHandler,
} from "@shared/handlers/paymentHandlers";
import { useTimerEffect } from "@shared/hooks/useTimerEffect";
import { useInsufficientBalanceTimer } from "@shared/hooks/useInsufficientBalanceTimer";
import { usePaymentProcessor } from "@shared/hooks/usePaymentProcessor";
import { useChangeDispenser } from "@shared/hooks/useChangeDispenser";
import {
  getStateColor,
  getStateText,
  calculateRemainingSeconds,
} from "@shared/utils/stateHelpers";

// ===== 시뮬레이터 컴포넌트 =====
function Simulator() {
  const [state, dispatch] = useReducer(vendingMachineReducer, initialState);
  const [isProcessing, setIsProcessing] = useState(false);

  // Custom hooks for side effects
  useTimerEffect(state.timer, dispatch);
  useInsufficientBalanceTimer(state.insufficientBalanceTime, dispatch);
  usePaymentProcessor(
    state.machineState,
    state.paymentMethod,
    state.selectedItem,
    isProcessing,
    setIsProcessing,
    dispatch
  );
  useChangeDispenser(
    state.machineState,
    state.changeDispenser,
    state.currentBalance,
    isProcessing,
    dispatch
  );

  // Payment handlers using useMemo to avoid recreating on every render
  const handleBillInsert = useMemo(
    () => createBillInsertHandler(dispatch),
    [dispatch]
  );
  const handleCoinInsert = useMemo(
    () => createCoinInsertHandler(dispatch),
    [dispatch]
  );
  const handleCardInsert = useMemo(
    () => createCardInsertHandler(dispatch),
    [dispatch]
  );

  const remainingSeconds = calculateRemainingSeconds(state.timer.remainingTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🥤 자판기 시뮬레이터 (모듈화)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 왼쪽: 입력 모듈 */}
          <div className="lg:col-span-1 space-y-4">
            {/* 디스플레이 */}
            <div className="bg-slate-800 rounded-lg p-6 border-2 border-slate-700">
              <div className="bg-green-900 text-green-300 p-4 rounded font-mono text-sm mb-4 min-h-32">
                <div className="font-bold mb-2">[ 자판기 디스플레이 ]</div>
                <div>{state.message}</div>
                <div className="mt-2 text-xl font-bold">
                  잔액: {state.currentBalance.toLocaleString()}원
                </div>
                {state.timer.state === TimerState.RUNNING &&
                  remainingSeconds > 0 && (
                    <div className="mt-2 text-yellow-300">
                      ⏰ 남은 시간: {remainingSeconds}초
                    </div>
                  )}
              </div>

              <div
                className={`${getStateColor(
                  state.machineState
                )} text-white px-4 py-2 rounded-lg text-center font-bold mb-4`}
              >
                {getStateText(state.machineState)}
              </div>

              {state.errorCode !== ErrorCode.NONE && (
                <div className="bg-red-900 text-red-300 px-4 py-2 rounded flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4" />[{state.errorCode}]
                </div>
              )}
            </div>

            {/* 지폐 인식 모듈 */}
            <div className="bg-slate-800 rounded-lg p-4 border-2 border-green-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4" />
                  지폐 인식 모듈
                </h3>
                <div
                  className={`text-xs px-2 py-1 rounded font-bold ${
                    state.billValidator.state === BillValidatorState.ERROR
                      ? "bg-red-600"
                      : state.billValidator.state ===
                        BillValidatorState.REJECTED
                      ? "bg-orange-600"
                      : state.billValidator.state ===
                          BillValidatorState.ACCEPTED ||
                        state.billValidator.state === BillValidatorState.STACKED
                      ? "bg-green-600"
                      : state.billValidator.state ===
                        BillValidatorState.VALIDATING
                      ? "bg-yellow-600"
                      : state.billValidator.state ===
                        BillValidatorState.DETECTING
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  } text-white`}
                >
                  {state.billValidator.state}
                </div>
              </div>

              <div className="text-xs text-slate-400 mb-3 space-y-1">
                <div>
                  총 승인: {state.billValidator.totalAccepted.toLocaleString()}
                  원
                </div>
                <div>거부: {state.billValidator.rejectionCount}회</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-slate-400 mb-1">정상 지폐</div>
                <div className="grid grid-cols-3 gap-2">
                  {[1000, 5000, 10000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleBillInsert(amount, false)}
                      disabled={
                        state.machineState ===
                          VendingMachineState.OUT_OF_SERVICE ||
                        state.billValidator.state !== BillValidatorState.IDLE
                      }
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-2 py-2 rounded font-bold text-xs"
                    >
                      {amount >= 1000 ? `${amount / 1000}천` : amount}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-400 mb-1 mt-3">
                  가짜 지폐 (테스트)
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1000, 5000, 10000].map((amount) => (
                    <button
                      key={`fake-${amount}`}
                      onClick={() => handleBillInsert(amount, true)}
                      disabled={
                        state.machineState ===
                          VendingMachineState.OUT_OF_SERVICE ||
                        state.billValidator.state !== BillValidatorState.IDLE
                      }
                      className="bg-red-700 hover:bg-red-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-2 py-2 rounded font-bold text-xs border-2 border-red-500"
                    >
                      ❌{amount >= 1000 ? `${amount / 1000}천` : amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 동전 인식 모듈 */}
            <div className="bg-slate-800 rounded-lg p-4 border-2 border-yellow-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                  <Coins className="w-4 h-4" />
                  동전 인식 모듈
                </h3>
                <div
                  className={`text-xs px-2 py-1 rounded font-bold ${
                    state.coinValidator.state === CoinValidatorState.ERROR
                      ? "bg-red-600"
                      : state.coinValidator.state ===
                        CoinValidatorState.REJECTED
                      ? "bg-orange-600"
                      : state.coinValidator.state ===
                          CoinValidatorState.ACCEPTED ||
                        state.coinValidator.state === CoinValidatorState.STORED
                      ? "bg-green-600"
                      : state.coinValidator.state ===
                        CoinValidatorState.VALIDATING
                      ? "bg-yellow-600"
                      : state.coinValidator.state ===
                        CoinValidatorState.DETECTING
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  } text-white`}
                >
                  {state.coinValidator.state}
                </div>
              </div>

              <div className="text-xs text-slate-400 mb-3 space-y-1">
                <div>
                  총 승인: {state.coinValidator.totalAccepted.toLocaleString()}
                  원
                </div>
                <div>거부: {state.coinValidator.rejectionCount}회</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-slate-400 mb-1">정상 동전</div>
                <div className="grid grid-cols-2 gap-2">
                  {[100, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleCoinInsert(amount, false)}
                      disabled={
                        state.machineState ===
                          VendingMachineState.OUT_OF_SERVICE ||
                        state.coinValidator.state !== CoinValidatorState.IDLE
                      }
                      className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-2 py-2 rounded font-bold text-xs"
                    >
                      {amount}원
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-400 mb-1 mt-3">
                  가짜 동전 (테스트)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[100, 500].map((amount) => (
                    <button
                      key={`fake-${amount}`}
                      onClick={() => handleCoinInsert(amount, true)}
                      disabled={
                        state.machineState ===
                          VendingMachineState.OUT_OF_SERVICE ||
                        state.coinValidator.state !== CoinValidatorState.IDLE
                      }
                      className="bg-red-700 hover:bg-red-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-2 py-2 rounded font-bold text-xs border-2 border-red-500"
                    >
                      ❌{amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 카드 리더기 모듈 */}
            <div className="bg-slate-800 rounded-lg p-4 border-2 border-blue-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4" />
                  카드 리더기
                </h3>
                <div
                  className={`text-xs px-2 py-1 rounded font-bold ${
                    state.cardReader.state === CardReaderState.ERROR
                      ? "bg-red-600"
                      : state.cardReader.state === CardReaderState.DECLINED
                      ? "bg-orange-600"
                      : state.cardReader.state === CardReaderState.APPROVED
                      ? "bg-green-600"
                      : state.cardReader.state === CardReaderState.PROCESSING ||
                        state.cardReader.state === CardReaderState.READING
                      ? "bg-yellow-600"
                      : state.cardReader.state === CardReaderState.CARD_DETECTED
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  } text-white`}
                >
                  {state.cardReader.state}
                </div>
              </div>

              <div className="text-xs text-slate-400 mb-3 space-y-1">
                <div>
                  카드: {state.cardReader.isCardInserted ? "삽입됨" : "없음"}
                </div>
                {state.cardReader.lastTransactionAmount > 0 && (
                  <div>
                    마지막:{" "}
                    {state.cardReader.lastTransactionAmount.toLocaleString()}원
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {!state.cardReader.isCardInserted ? (
                  <button
                    onClick={handleCardInsert}
                    disabled={
                      state.machineState === VendingMachineState.OUT_OF_SERVICE
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded font-bold text-sm"
                  >
                    카드 삽입
                  </button>
                ) : (
                  <button
                    onClick={() => dispatch({ type: "CARD_REMOVE" })}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-bold text-sm"
                  >
                    카드 제거
                  </button>
                )}
              </div>
            </div>

            {/* 취소 */}
            <button
              onClick={() => dispatch({ type: "CANCEL" })}
              disabled={
                state.machineState === VendingMachineState.IDLE ||
                state.machineState === VendingMachineState.OUT_OF_SERVICE
              }
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold"
            >
              취소 / 반환
            </button>
          </div>

          {/* 중앙: 음료 메뉴 & 선택 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 음료 메뉴 + 선택 버튼 */}
            <div className="bg-slate-800 rounded-lg p-6 border-2 border-slate-700">
              <h3 className="text-white font-bold mb-4 text-xl flex items-center gap-2">
                <Package className="w-6 h-6" />
                음료 선택
              </h3>
              <div className="space-y-3">
                {DRINKS.map((drink) => {
                  const stock = state.inventorySensor.inventory[drink.id] ?? 0;
                  const isOutOfStock = stock <= 0;
                  const isSelected = state.selectedButtonId === drink.id;
                  const isActive =
                    state.selectedItem?.id === drink.id &&
                    (state.machineState === VendingMachineState.ITEM_SELECTED ||
                      state.machineState === VendingMachineState.DISPENSING);

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
                          state.machineState ===
                            VendingMachineState.OUT_OF_SERVICE ||
                          state.machineState ===
                            VendingMachineState.DISPENSING ||
                          state.machineState ===
                            VendingMachineState.RETURNING_CHANGE ||
                          state.changeDispenser.state ===
                            ChangeDispenserState.DISPENSING ||
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

            {/* 하단 출력 패널 */}
            <div className="bg-slate-800 rounded-lg p-6 border-2 border-purple-700">
              <h3 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                출력 패널
              </h3>

              {/* 음료 출력구 */}
              <div className="bg-slate-900 rounded-lg p-4 mb-3 min-h-24">
                <div className="text-slate-400 text-sm mb-2">
                  🥤 음료 출력구
                </div>
                {state.dispenser.state === DispenserState.DISPENSING && (
                  <div className="flex items-center gap-3 text-green-400">
                    <div className="animate-bounce text-3xl">🥤</div>
                    <div>
                      <div className="font-bold">
                        {state.selectedItem?.name}
                      </div>
                      <div className="text-sm">배출 중...</div>
                    </div>
                  </div>
                )}
                {state.dispenser.state === DispenserState.COMPLETED &&
                  state.dispenser.lastDispensedItem && (
                    <div className="flex items-center gap-3 text-green-400">
                      <div className="text-3xl">✅</div>
                      <div>
                        <div className="font-bold">
                          {state.dispenser.lastDispensedItem.name}
                        </div>
                        <div className="text-sm">배출 완료!</div>
                      </div>
                    </div>
                  )}
                {state.dispenser.state === DispenserState.JAMMED && (
                  <div className="text-red-400 text-center py-4">
                    <div className="text-2xl mb-2">⚠️</div>
                    <div className="font-bold">배출 실패 (걸림)</div>
                  </div>
                )}
                {state.dispenser.state === DispenserState.IDLE &&
                  !state.dispenser.lastDispensedItem && (
                    <div className="text-slate-600 text-center py-4">
                      대기중
                    </div>
                  )}
              </div>

              {/* 거스름돈 출력구 */}
              <div className="bg-slate-900 rounded-lg p-4 min-h-24">
                <div className="text-slate-400 text-sm mb-2">
                  💰 거스름돈 출력구
                </div>
                {state.changeDispenser.state ===
                  ChangeDispenserState.CALCULATING && (
                  <div className="text-yellow-400 text-center py-2">
                    <div className="text-sm">계산 중...</div>
                    <div className="font-bold">
                      {state.changeDispenser.remainingChange.toLocaleString()}원
                    </div>
                  </div>
                )}
                {state.changeDispenser.state ===
                  ChangeDispenserState.DISPENSING && (
                  <div className="space-y-2">
                    <div className="text-blue-400 text-sm font-bold">
                      반환 중... (남은:{" "}
                      {state.changeDispenser.remainingChange.toLocaleString()}
                      원)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {state.changeDispenser.dispensedBills.map((bill, idx) => (
                        <div
                          key={`bill-${idx}`}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold animate-bounce"
                        >
                          💵 {bill}원
                        </div>
                      ))}
                      {state.changeDispenser.dispensedCoins.map((coin, idx) => (
                        <div
                          key={`coin-${idx}`}
                          className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold animate-bounce"
                        >
                          🪙 {coin}원
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {state.changeDispenser.state ===
                  ChangeDispenserState.COMPLETED && (
                  <div className="text-green-400">
                    <div className="text-sm mb-2">✅ 반환 완료</div>
                    <div className="flex flex-wrap gap-1 text-xs">
                      {state.changeDispenser.dispensedBills.length > 0 && (
                        <span>
                          지폐:{" "}
                          {state.changeDispenser.dispensedBills
                            .reduce<number>((acc, value) => acc + value, 0)
                            .toLocaleString()}
                          원
                        </span>
                      )}
                      {state.changeDispenser.dispensedCoins.length > 0 && (
                        <span className="ml-2">
                          동전:{" "}
                          {state.changeDispenser.dispensedCoins
                            .reduce<number>((acc, value) => acc + value, 0)
                            .toLocaleString()}
                          원
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {state.changeDispenser.state === ChangeDispenserState.IDLE &&
                  state.changeDispenser.dispensedBills.length === 0 &&
                  state.changeDispenser.dispensedCoins.length === 0 && (
                    <div className="text-slate-600 text-center py-4">
                      대기중
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* 오른쪽: 출력 모듈 상태 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 타이머와 재고/배출기 */}
            <div className="grid grid-cols-1 gap-4">
              {/* 타이머 모듈 - 크게 */}
              <div className="bg-slate-800 rounded-lg p-6 border-2 border-purple-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                    <Clock className="w-6 h-6" />
                    타이머 모듈
                  </h3>
                  <div
                    className={`text-sm px-4 py-2 rounded-lg font-bold ${
                      state.timer.state === TimerState.RUNNING
                        ? "bg-blue-600"
                        : state.timer.state === TimerState.EXPIRED
                        ? "bg-red-600"
                        : state.timer.state === TimerState.PAUSED
                        ? "bg-yellow-600"
                        : "bg-gray-600"
                    } text-white`}
                  >
                    {state.timer.state}
                  </div>
                </div>

                {state.timer.state === TimerState.RUNNING && (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white mb-2">
                      {remainingSeconds}
                    </div>
                    <div className="text-slate-400 text-sm">초 남음</div>
                    <div className="mt-4 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
                        style={{
                          width: `${
                            (state.timer.remainingTime / state.timer.duration) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {state.timer.state === TimerState.IDLE && (
                  <div className="text-center text-slate-400 py-8">
                    타이머 대기중
                  </div>
                )}

                {state.timer.state === TimerState.EXPIRED && (
                  <div className="text-center text-red-400 py-8 font-bold">
                    ⏰ 시간 초과!
                  </div>
                )}
              </div>

              {/* 재고 센서, 배출기, 거스름돈 반환기 */}
              <div className="grid grid-cols-3 gap-4">
                <ModuleStatusPanel
                  title="재고 센서"
                  state={state.inventorySensor.state}
                  icon={Package}
                  color="border-orange-600"
                  details={[
                    `총 재고: ${Object.values(
                      state.inventorySensor.inventory
                    ).reduce(
                      (acc: number, value: number) => acc + value,
                      0
                    )}개`,
                  ]}
                />

                <ModuleStatusPanel
                  title="배출기"
                  state={state.dispenser.state}
                  icon={Cpu}
                  color="border-pink-600"
                  details={[
                    state.dispenser.lastDispensedItem
                      ? `마지막: ${state.dispenser.lastDispensedItem.name}`
                      : "대기중",
                  ]}
                />

                <ModuleStatusPanel
                  title="거스름돈 반환기"
                  state={state.changeDispenser.state}
                  icon={Coins}
                  color="border-emerald-600"
                  details={[
                    state.changeDispenser.remainingChange > 0
                      ? `남은: ${state.changeDispenser.remainingChange}원`
                      : "대기중",
                    `지폐: ${state.changeDispenser.dispensedBills.length}개`,
                    `동전: ${state.changeDispenser.dispensedCoins.length}개`,
                  ].filter(
                    (d) =>
                      d !== "대기중" ||
                      state.changeDispenser.state === ChangeDispenserState.IDLE
                  )}
                />
              </div>
            </div>

            {/* 이벤트 로그 */}
            <div className="bg-slate-800 rounded-lg p-6 border-2 border-slate-700">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                이벤트 로그
              </h3>
              <div className="space-y-1 text-xs font-mono max-h-96 overflow-y-auto">
                {state.eventLog
                  .slice()
                  .reverse()
                  .map((log, idx) => (
                    <div key={idx} className="text-slate-400">
                      <span className="text-slate-500">[{log.time}]</span>
                      <span
                        className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                          log.module === "BILL"
                            ? "bg-green-900 text-green-300"
                            : log.module === "COIN"
                            ? "bg-yellow-900 text-yellow-300"
                            : log.module === "CARD"
                            ? "bg-blue-900 text-blue-300"
                            : log.module === "TIMER"
                            ? "bg-purple-900 text-purple-300"
                            : log.module === "INVENTORY"
                            ? "bg-orange-900 text-orange-300"
                            : log.module === "DISPENSER"
                            ? "bg-pink-900 text-pink-300"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {log.module}
                      </span>
                      <span className="ml-2">{log.message}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* 시스템 정보 */}
            <div className="bg-slate-800 rounded-lg p-4 border-2 border-slate-700">
              <h3 className="text-white font-bold mb-3 text-sm">시스템 정보</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="text-slate-400">
                    <div className="font-bold text-white mb-1">입력 모듈</div>
                    <div>
                      지폐: {state.billValidator.totalAccepted.toLocaleString()}
                      원 승인
                    </div>
                    <div>
                      동전: {state.coinValidator.totalAccepted.toLocaleString()}
                      원 승인
                    </div>
                    <div>
                      카드:{" "}
                      {state.cardReader.isCardInserted ? "삽입됨" : "없음"}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-slate-400">
                    <div className="font-bold text-white mb-1">출력 모듈</div>
                    <div>
                      거스름돈: {state.changeReserve.bills1000}장(1000원),{" "}
                      {state.changeReserve.coins500}개(500원)
                    </div>
                    <div>
                      총 재고:{" "}
                      {Object.values(state.inventorySensor.inventory).reduce(
                        (acc: number, value: number) => acc + value,
                        0
                      )}
                      개
                    </div>
                    <div>배출기: {state.dispenser.state}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 관리자 */}
            <div className="bg-slate-800 rounded-lg p-4 border-2 border-yellow-600">
              <h3 className="text-yellow-400 font-bold mb-3 text-sm">
                🔧 관리자 패널
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() =>
                    dispatch({
                      type: "SET_OUT_OF_SERVICE",
                      errorCode: ErrorCode.SYSTEM_ERROR,
                      reason: "시스템 오류",
                    })
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-bold"
                >
                  고장 (E999)
                </button>
                <button
                  onClick={() => dispatch({ type: "RESET" })}
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-bold"
                >
                  리셋
                </button>
                <button
                  onClick={() =>
                    dispatch({ type: "ADD_CHANGE_RESERVE_1000", amount: 10 })
                  }
                  className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-bold"
                >
                  1000원 +10장
                </button>
                <button
                  onClick={() =>
                    dispatch({ type: "ADD_CHANGE_RESERVE_500", amount: 10 })
                  }
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-xs font-bold"
                >
                  500원 +10개
                </button>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1">
                {DRINKS.slice(0, 6).map((drink) => (
                  <button
                    key={drink.id}
                    onClick={() =>
                      dispatch({
                        type: "INVENTORY_RESTOCK",
                        itemId: drink.id,
                        amount: 5,
                        itemName: drink.name,
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-1 py-1 rounded text-xs"
                    title={`${drink.name} +5`}
                  >
                    #{drink.id}+5
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SimulatorPage = () => (
  <>
    <Simulator />
  </>
);

export default SimulatorPage;
