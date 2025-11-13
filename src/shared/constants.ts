import type { Drink, InventoryRecord, VendingMachineContext } from "@shared/types";
import {
  VendingMachineState,
  BillValidatorState,
  CoinValidatorState,
  CardReaderState,
  TimerState,
  InventorySensorState,
  DispenserState,
  ChangeDispenserState,
  PaymentMethod,
  ErrorCode,
} from "@shared/states";

export const DRINKS: Drink[] = [
  { id: "1", name: "콜라", price: 1500, stock: 10 },
  { id: "2", name: "사이다", price: 1500, stock: 8 },
  { id: "3", name: "오렌지주스", price: 2000, stock: 5 },
  { id: "4", name: "커피", price: 1000, stock: 0 },
  { id: "5", name: "녹차", price: 1200, stock: 12 },
  { id: "6", name: "이온음료", price: 1800, stock: 3 },
];

export const PAYMENT_TIMEOUT = 60000; // 60초
export const INSUFFICIENT_BALANCE_WAIT = 5000; // 5초

export const createInitialInventory = (): InventoryRecord =>
  DRINKS.reduce<InventoryRecord>((acc, drink) => {
    acc[drink.id] = drink.stock;
    return acc;
  }, {} as InventoryRecord);

// ===== 초기 상태 =====
export const initialState: VendingMachineContext = {
  // 메인 자판기
  machineState: VendingMachineState.IDLE,
  currentBalance: 0,
  selectedItem: null,
  paymentMethod: PaymentMethod.NONE,
  changeReserve: {
    bills1000: 30,  // 1000원 지폐 30장 (30,000원)
    coins500: 40,   // 500원 동전 40개 (20,000원)
  },
  message: "음료를 선택하거나 금액을 투입하세요",
  errorCode: ErrorCode.NONE,

  // 외부 모듈 상태
  billValidator: {
    state: BillValidatorState.IDLE,
    lastBillAmount: 0,
    totalAccepted: 0,
    rejectionCount: 0,
  },

  coinValidator: {
    state: CoinValidatorState.IDLE,
    lastCoinAmount: 0,
    totalAccepted: 0,
    rejectionCount: 0,
  },

  cardReader: {
    state: CardReaderState.IDLE,
    isCardInserted: false,
    lastTransactionAmount: 0,
  },

  timer: {
    state: TimerState.IDLE,
    startTime: null,
    duration: PAYMENT_TIMEOUT,
    remainingTime: 0,
  },

  inventorySensor: {
    state: InventorySensorState.IDLE,
    inventory: createInitialInventory(),
  },

  dispenser: {
    state: DispenserState.IDLE,
    lastDispensedItem: null,
  },

  changeDispenser: {
    state: ChangeDispenserState.IDLE,
    remainingChange: 0,
    dispensedCoins: [],
    dispensedBills: [],
  },

  selectedButtonId: null,
  eventLog: [],
  insufficientBalanceTime: null,
};
