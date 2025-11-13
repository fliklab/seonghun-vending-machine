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

export type VendingMachineAction =
  // Bill Validator Actions
  | { type: "BILL_INSERT_START" }
  | { type: "BILL_VALIDATING"; amount: number }
  | { type: "BILL_ACCEPTED"; amount: number }
  | { type: "BILL_REJECTED"; reason: string }
  | { type: "BILL_STACKED" }
  | { type: "BILL_VALIDATOR_RESET" }
  // Coin Validator Actions
  | { type: "COIN_INSERT_START" }
  | { type: "COIN_VALIDATING"; amount: number }
  | { type: "COIN_ACCEPTED"; amount: number }
  | { type: "COIN_REJECTED"; reason: string }
  | { type: "COIN_STORED" }
  | { type: "COIN_VALIDATOR_RESET" }
  // Card Reader Actions
  | { type: "CARD_INSERT" }
  | { type: "CARD_READING" }
  | { type: "CARD_PROCESSING"; amount: number }
  | { type: "CARD_APPROVED"; amount: number }
  | { type: "CARD_DECLINED"; reason: string }
  | { type: "CARD_REMOVE" }
  // Timer Actions
  | { type: "TIMER_START"; duration?: number }
  | { type: "TIMER_PAUSE" }
  | { type: "TIMER_RESUME" }
  | { type: "TIMER_EXPIRED" }
  | { type: "TIMER_RESET" }
  | { type: "TIMER_UPDATE"; remainingTime: number }
  // Inventory Actions
  | { type: "INVENTORY_CHECK_START"; itemId: string }
  | { type: "INVENTORY_AVAILABLE"; itemName: string }
  | { type: "INVENTORY_OUT_OF_STOCK"; itemName: string }
  | { type: "INVENTORY_DECREASE"; itemId: string; itemName: string }
  | { type: "INVENTORY_RESTOCK"; itemId: string; itemName: string; amount?: number }
  // Payment Actions
  | { type: "SELECT_ITEM"; itemId: string }
  | { type: "INSUFFICIENT_BALANCE_RESET" }
  // Change Dispenser Actions
  | { type: "START_CHANGE_DISPENSING"; amount: number }
  | { type: "DISPENSE_CHANGE_BILL"; amount: number }
  | { type: "DISPENSE_CHANGE_COIN"; amount: number }
  | { type: "CHANGE_DISPENSING_COMPLETE" }
  | { type: "CHANGE_DISPENSER_RESET" }
  // Dispenser Actions
  | { type: "DISPENSER_START"; item: Drink }
  | { type: "DISPENSER_COMPLETED" }
  | { type: "DISPENSER_JAMMED" }
  | { type: "DISPENSER_RESET" }
  // Transaction Actions
  | { type: "RETURN_CHANGE_COMPLETE" }
  | { type: "CANCEL" }
  // System Actions
  | { type: "SET_OUT_OF_SERVICE"; errorCode?: ErrorCodeValue; reason?: string }
  | { type: "RESET" }
  | { type: "ADD_CHANGE_RESERVE_1000"; amount: number }
  | { type: "ADD_CHANGE_RESERVE_500"; amount: number };

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
  bills1000: number; // 1000원 지폐 개수
  coins500: number; // 500원 동전 개수
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

// State value types
export type VendingMachineStateValue =
  typeof import("./states").VendingMachineState[keyof typeof import("./states").VendingMachineState];
export type BillValidatorStateValue =
  typeof import("./states").BillValidatorState[keyof typeof import("./states").BillValidatorState];
export type CoinValidatorStateValue =
  typeof import("./states").CoinValidatorState[keyof typeof import("./states").CoinValidatorState];
export type CardReaderStateValue =
  typeof import("./states").CardReaderState[keyof typeof import("./states").CardReaderState];
export type TimerStateValue =
  typeof import("./states").TimerState[keyof typeof import("./states").TimerState];
export type InventorySensorStateValue =
  typeof import("./states").InventorySensorState[keyof typeof import("./states").InventorySensorState];
export type DispenserStateValue =
  typeof import("./states").DispenserState[keyof typeof import("./states").DispenserState];
export type ChangeDispenserStateValue =
  typeof import("./states").ChangeDispenserState[keyof typeof import("./states").ChangeDispenserState];
export type PaymentMethodValue =
  typeof import("./states").PaymentMethod[keyof typeof import("./states").PaymentMethod];
export type ErrorCodeValue =
  typeof import("./states").ErrorCode[keyof typeof import("./states").ErrorCode];
