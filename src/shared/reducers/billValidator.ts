import type { MachineReducer } from "@shared/types";
import {
  VendingMachineState,
  BillValidatorState,
  TimerState,
  PaymentMethod,
} from "@shared/states";

// 지폐 인식 모듈 리듀서
export const billValidatorReducer: MachineReducer = (context, action, addLog) => {
  switch (action.type) {
    case "BILL_INSERT_START":
      return {
        ...context,
        billValidator: {
          ...context.billValidator,
          state: BillValidatorState.DETECTING,
        },
        eventLog: addLog("지폐 감지 시작", "BILL"),
      };

    case "BILL_VALIDATING":
      return {
        ...context,
        billValidator: {
          ...context.billValidator,
          state: BillValidatorState.VALIDATING,
          lastBillAmount: action.amount,
        },
        eventLog: addLog(`${action.amount}원 지폐 검증중...`, "BILL"),
      };

    case "BILL_ACCEPTED":
      const newBalance = context.currentBalance + action.amount;
      return {
        ...context,
        machineState: VendingMachineState.PAYMENT_IN_PROGRESS,
        currentBalance: newBalance,
        paymentMethod: PaymentMethod.CASH,
        billValidator: {
          ...context.billValidator,
          state: BillValidatorState.ACCEPTED,
          totalAccepted: context.billValidator.totalAccepted + action.amount,
        },
        timer: {
          ...context.timer,
          state: TimerState.RUNNING,
          startTime: Date.now(),
        },
        insufficientBalanceTime: null,
        message: `${action.amount}원 투입됨. 현재 잔액: ${newBalance}원`,
        eventLog: addLog(`✅ ${action.amount}원 지폐 승인`, "BILL"),
      };

    case "BILL_REJECTED":
      return {
        ...context,
        billValidator: {
          ...context.billValidator,
          state: BillValidatorState.REJECTED,
          rejectionCount: context.billValidator.rejectionCount + 1,
        },
        message: `지폐가 거부되었습니다. (${action.reason})`,
        eventLog: addLog(`❌ 지폐 거부: ${action.reason}`, "BILL"),
      };

    case "BILL_STACKED":
      return {
        ...context,
        billValidator: {
          ...context.billValidator,
          state: BillValidatorState.STACKED,
        },
        eventLog: addLog("지폐 보관 완료", "BILL"),
      };

    case "BILL_VALIDATOR_RESET":
      return {
        ...context,
        billValidator: {
          ...context.billValidator,
          state: BillValidatorState.IDLE,
        },
      };

    default:
      return null;
  }
};
