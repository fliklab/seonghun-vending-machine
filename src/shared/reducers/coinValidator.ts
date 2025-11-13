import type { MachineReducer } from "../types";
import {
  VendingMachineState,
  CoinValidatorState,
  TimerState,
  PaymentMethod,
} from "../states";

// 동전 인식 모듈 리듀서
export const coinValidatorReducer: MachineReducer = (context, action, addLog) => {
  switch (action.type) {
    case "COIN_INSERT_START":
      return {
        ...context,
        coinValidator: {
          ...context.coinValidator,
          state: CoinValidatorState.DETECTING,
        },
        eventLog: addLog("동전 감지 시작", "COIN"),
      };

    case "COIN_VALIDATING":
      return {
        ...context,
        coinValidator: {
          ...context.coinValidator,
          state: CoinValidatorState.VALIDATING,
          lastCoinAmount: action.amount,
        },
        eventLog: addLog(`${action.amount}원 동전 검증중...`, "COIN"),
      };

    case "COIN_ACCEPTED":
      const coinBalance = context.currentBalance + action.amount;
      return {
        ...context,
        machineState: VendingMachineState.PAYMENT_IN_PROGRESS,
        currentBalance: coinBalance,
        paymentMethod: PaymentMethod.COIN,
        coinValidator: {
          ...context.coinValidator,
          state: CoinValidatorState.ACCEPTED,
          totalAccepted: context.coinValidator.totalAccepted + action.amount,
        },
        timer: {
          ...context.timer,
          state: TimerState.RUNNING,
          startTime: Date.now(),
        },
        insufficientBalanceTime: null,
        message: `${action.amount}원 투입됨. 현재 잔액: ${coinBalance}원`,
        eventLog: addLog(`✅ ${action.amount}원 동전 승인`, "COIN"),
      };

    case "COIN_REJECTED":
      return {
        ...context,
        coinValidator: {
          ...context.coinValidator,
          state: CoinValidatorState.REJECTED,
          rejectionCount: context.coinValidator.rejectionCount + 1,
        },
        message: `동전이 거부되었습니다. (${action.reason})`,
        eventLog: addLog(`❌ 동전 거부: ${action.reason}`, "COIN"),
      };

    case "COIN_STORED":
      return {
        ...context,
        coinValidator: {
          ...context.coinValidator,
          state: CoinValidatorState.STORED,
        },
        eventLog: addLog("동전 보관 완료", "COIN"),
      };

    case "COIN_VALIDATOR_RESET":
      return {
        ...context,
        coinValidator: {
          ...context.coinValidator,
          state: CoinValidatorState.IDLE,
        },
      };

    default:
      return null;
  }
};
