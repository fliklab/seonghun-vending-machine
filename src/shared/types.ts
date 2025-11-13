import type { LucideIcon } from "lucide-react";

export type Drink = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type EventLogEntry = {
  time: string;
  module: string;
  message: string;
};

export type AddLog = (message: string, module?: string) => EventLogEntry[];

export type VendingMachineAction = {
  type: string;
  [key: string]: any;
};

export type InventoryRecord = Record<string, number>;

export interface BillValidator {
  state: BillValidatorStateValue;
  lastBillAmount: number;
  totalAccepted: number;
  rejectionCount: number;
}

export interface CoinValidator {
  state: CoinValidatorStateValue;
  lastCoinAmount: number;
  totalAccepted: number;
  rejectionCount: number;
}

export interface CardReader {
  state: CardReaderStateValue;
  isCardInserted: boolean;
  lastTransactionAmount: number;
}

export interface TimerModule {
  state: TimerStateValue;
  startTime: number | null;
  duration: number;
  remainingTime: number;
}

export interface InventorySensor {
  state: InventorySensorStateValue;
  inventory: InventoryRecord;
}

export interface Dispenser {
  state: DispenserStateValue;
  lastDispensedItem: Drink | null;
}

export interface ChangeDispenser {
  state: ChangeDispenserStateValue;
  remainingChange: number;
  dispensedCoins: number[];
  dispensedBills: number[];
}

export interface ChangeReserve {
  bills1000: number;  // 1000원 지폐 개수
  coins500: number;   // 500원 동전 개수
}

export interface VendingMachineContext {
  machineState: VendingMachineStateValue;
  currentBalance: number;
  selectedItem: Drink | null;
  paymentMethod: PaymentMethodValue;
  changeReserve: ChangeReserve;
  message: string;
  errorCode: ErrorCodeValue;
  billValidator: BillValidator;
  coinValidator: CoinValidator;
  cardReader: CardReader;
  timer: TimerModule;
  inventorySensor: InventorySensor;
  dispenser: Dispenser;
  changeDispenser: ChangeDispenser;
  selectedButtonId: string | null;
  eventLog: EventLogEntry[];
  insufficientBalanceTime: number | null;
}

export type MachineReducer<
  TAction extends VendingMachineAction = VendingMachineAction,
  TResult = VendingMachineContext | null
> = (
  context: VendingMachineContext,
  action: TAction,
  addLog: AddLog
) => TResult;

export type ModuleStatusPanelProps = {
  title: string;
  state: string;
  icon: LucideIcon;
  color: string;
  details?: string[];
};

// State value types
export type VendingMachineStateValue =
  (typeof import("./states").VendingMachineState)[keyof typeof import("./states").VendingMachineState];
export type BillValidatorStateValue =
  (typeof import("./states").BillValidatorState)[keyof typeof import("./states").BillValidatorState];
export type CoinValidatorStateValue =
  (typeof import("./states").CoinValidatorState)[keyof typeof import("./states").CoinValidatorState];
export type CardReaderStateValue =
  (typeof import("./states").CardReaderState)[keyof typeof import("./states").CardReaderState];
export type TimerStateValue = (typeof import("./states").TimerState)[keyof typeof import("./states").TimerState];
export type InventorySensorStateValue =
  (typeof import("./states").InventorySensorState)[keyof typeof import("./states").InventorySensorState];
export type DispenserStateValue = (typeof import("./states").DispenserState)[keyof typeof import("./states").DispenserState];
export type ChangeDispenserStateValue =
  (typeof import("./states").ChangeDispenserState)[keyof typeof import("./states").ChangeDispenserState];
export type PaymentMethodValue = (typeof import("./states").PaymentMethod)[keyof typeof import("./states").PaymentMethod];
export type ErrorCodeValue = (typeof import("./states").ErrorCode)[keyof typeof import("./states").ErrorCode];
