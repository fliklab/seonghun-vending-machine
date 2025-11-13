import { Coins, CreditCard, DollarSign } from "lucide-react";
import type { Dispatch } from "react";
import {
  BillValidatorState,
  CardReaderState,
  CoinValidatorState,
  VendingMachineState,
} from "@shared/states";
import type {
  BillValidator,
  CardReader,
  CoinValidator,
  VendingMachineAction,
  VendingMachineStateValue,
} from "@shared/types";

interface InputModulesProps {
  machineState: VendingMachineStateValue;
  billValidator: BillValidator;
  coinValidator: CoinValidator;
  cardReader: CardReader;
  onBillInsert: (amount: number, isFake: boolean) => void;
  onCoinInsert: (amount: number, isFake: boolean) => void;
  onCardInsert: () => void;
  dispatch: Dispatch<VendingMachineAction>;
}

export const InputModules = ({
  machineState,
  billValidator,
  coinValidator,
  cardReader,
  onBillInsert,
  onCoinInsert,
  onCardInsert,
  dispatch,
}: InputModulesProps) => {
  return (
    <>
      {/* 지폐 인식 모듈 */}
      <div className="bg-slate-800 rounded-lg p-4 border-2 border-green-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4" />
            지폐 인식 모듈
          </h3>
          <div
            className={`text-xs px-2 py-1 rounded font-bold ${
              billValidator.state === BillValidatorState.ERROR
                ? "bg-red-600"
                : billValidator.state === BillValidatorState.REJECTED
                ? "bg-orange-600"
                : billValidator.state === BillValidatorState.ACCEPTED ||
                  billValidator.state === BillValidatorState.STACKED
                ? "bg-green-600"
                : billValidator.state === BillValidatorState.VALIDATING
                ? "bg-yellow-600"
                : billValidator.state === BillValidatorState.DETECTING
                ? "bg-blue-600"
                : "bg-gray-600"
            } text-white`}
          >
            {billValidator.state}
          </div>
        </div>

        <div className="text-xs text-slate-400 mb-3 space-y-1">
          <div>총 승인: {billValidator.totalAccepted.toLocaleString()}원</div>
          <div>거부: {billValidator.rejectionCount}회</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-slate-400 mb-1">정상 지폐</div>
          <div className="grid grid-cols-3 gap-2">
            {[1000, 5000, 10000].map((amount) => (
              <button
                key={amount}
                onClick={() => onBillInsert(amount, false)}
                disabled={
                  machineState === VendingMachineState.OUT_OF_SERVICE ||
                  billValidator.state !== BillValidatorState.IDLE
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
                onClick={() => onBillInsert(amount, true)}
                disabled={
                  machineState === VendingMachineState.OUT_OF_SERVICE ||
                  billValidator.state !== BillValidatorState.IDLE
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
              coinValidator.state === CoinValidatorState.ERROR
                ? "bg-red-600"
                : coinValidator.state === CoinValidatorState.REJECTED
                ? "bg-orange-600"
                : coinValidator.state === CoinValidatorState.ACCEPTED ||
                  coinValidator.state === CoinValidatorState.STORED
                ? "bg-green-600"
                : coinValidator.state === CoinValidatorState.VALIDATING
                ? "bg-yellow-600"
                : coinValidator.state === CoinValidatorState.DETECTING
                ? "bg-blue-600"
                : "bg-gray-600"
            } text-white`}
          >
            {coinValidator.state}
          </div>
        </div>

        <div className="text-xs text-slate-400 mb-3 space-y-1">
          <div>총 승인: {coinValidator.totalAccepted.toLocaleString()}원</div>
          <div>거부: {coinValidator.rejectionCount}회</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-slate-400 mb-1">정상 동전</div>
          <div className="grid grid-cols-2 gap-2">
            {[100, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => onCoinInsert(amount, false)}
                disabled={
                  machineState === VendingMachineState.OUT_OF_SERVICE ||
                  coinValidator.state !== CoinValidatorState.IDLE
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
                onClick={() => onCoinInsert(amount, true)}
                disabled={
                  machineState === VendingMachineState.OUT_OF_SERVICE ||
                  coinValidator.state !== CoinValidatorState.IDLE
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
              cardReader.state === CardReaderState.ERROR
                ? "bg-red-600"
                : cardReader.state === CardReaderState.DECLINED
                ? "bg-orange-600"
                : cardReader.state === CardReaderState.APPROVED
                ? "bg-green-600"
                : cardReader.state === CardReaderState.PROCESSING ||
                  cardReader.state === CardReaderState.READING
                ? "bg-yellow-600"
                : cardReader.state === CardReaderState.CARD_DETECTED
                ? "bg-blue-600"
                : "bg-gray-600"
            } text-white`}
          >
            {cardReader.state}
          </div>
        </div>

        <div className="text-xs text-slate-400 mb-3 space-y-1">
          <div>카드: {cardReader.isCardInserted ? "삽입됨" : "없음"}</div>
          {cardReader.lastTransactionAmount > 0 && (
            <div>
              마지막: {cardReader.lastTransactionAmount.toLocaleString()}원
            </div>
          )}
        </div>

        <div className="space-y-2">
          {!cardReader.isCardInserted ? (
            <button
              onClick={onCardInsert}
              disabled={machineState === VendingMachineState.OUT_OF_SERVICE}
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

      {/* 취소 버튼 */}
      <button
        onClick={() => dispatch({ type: "CANCEL" })}
        disabled={
          machineState === VendingMachineState.IDLE ||
          machineState === VendingMachineState.OUT_OF_SERVICE
        }
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold"
      >
        취소 / 반환
      </button>
    </>
  );
};
