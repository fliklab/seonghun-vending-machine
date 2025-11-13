import { AlertCircle } from "lucide-react";
import { ErrorCode, TimerState } from "@shared/states";
import type {
  ErrorCodeValue,
  TimerModule,
  VendingMachineStateValue,
} from "@shared/types";
import {
  calculateRemainingSeconds,
  getStateColor,
  getStateText,
} from "@shared/utils/stateHelpers";

interface DisplayPanelProps {
  message: string;
  currentBalance: number;
  timer: TimerModule;
  machineState: VendingMachineStateValue;
  errorCode: ErrorCodeValue;
}

export const DisplayPanel = ({
  message,
  currentBalance,
  timer,
  machineState,
  errorCode,
}: DisplayPanelProps) => {
  const remainingSeconds = calculateRemainingSeconds(timer.remainingTime);

  return (
    <div className="bg-slate-800 rounded-lg p-6 border-2 border-slate-700">
      <div className="bg-green-900 text-green-300 p-4 rounded font-mono text-sm mb-4 min-h-32">
        <div className="font-bold mb-2">[ 자판기 디스플레이 ]</div>
        <div>{message}</div>
        <div className="mt-2 text-xl font-bold">
          잔액: {currentBalance.toLocaleString()}원
        </div>
        {timer.state === TimerState.RUNNING && remainingSeconds > 0 && (
          <div className="mt-2 text-yellow-300">
            ⏰ 남은 시간: {remainingSeconds}초
          </div>
        )}
      </div>

      <div
        className={`${getStateColor(
          machineState
        )} text-white px-4 py-2 rounded-lg text-center font-bold mb-4`}
      >
        {getStateText(machineState)}
      </div>

      {errorCode !== ErrorCode.NONE && (
        <div className="bg-red-900 text-red-300 px-4 py-2 rounded flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />[{errorCode}]
        </div>
      )}
    </div>
  );
};
