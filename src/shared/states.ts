// ===== 시스템 상태 정의 =====

// 메인 자판기 상태
export const VendingMachineState = {
  IDLE: "IDLE",
  PAYMENT_IN_PROGRESS: "PAYMENT_IN_PROGRESS",
  ITEM_SELECTED: "ITEM_SELECTED",
  DISPENSING: "DISPENSING",
  RETURNING_CHANGE: "RETURNING_CHANGE",
  ERROR: "ERROR",
  OUT_OF_SERVICE: "OUT_OF_SERVICE",
} as const;

// 지폐 인식 모듈 상태
export const BillValidatorState = {
  IDLE: "IDLE",
  DETECTING: "DETECTING",
  VALIDATING: "VALIDATING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  STACKED: "STACKED",
  ERROR: "ERROR",
} as const;

// 동전 인식 모듈 상태
export const CoinValidatorState = {
  IDLE: "IDLE",
  DETECTING: "DETECTING",
  VALIDATING: "VALIDATING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  STORED: "STORED",
  ERROR: "ERROR",
} as const;

// 카드 리더기 상태
export const CardReaderState = {
  IDLE: "IDLE",
  CARD_DETECTED: "CARD_DETECTED",
  READING: "READING",
  PROCESSING: "PROCESSING",
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
  ERROR: "ERROR",
} as const;

// 타이머 모듈 상태
export const TimerState = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
  EXPIRED: "EXPIRED",
  RESET: "RESET",
} as const;

// 재고 센서 상태
export const InventorySensorState = {
  IDLE: "IDLE",
  CHECKING: "CHECKING",
  AVAILABLE: "AVAILABLE",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  ERROR: "ERROR",
} as const;

// 배출기 상태
export const DispenserState = {
  IDLE: "IDLE",
  DISPENSING: "DISPENSING",
  COMPLETED: "COMPLETED",
  JAMMED: "JAMMED",
  ERROR: "ERROR",
} as const;

// 거스름돈 반환기 상태
export const ChangeDispenserState = {
  IDLE: "IDLE",
  CALCULATING: "CALCULATING",
  DISPENSING: "DISPENSING",
  COMPLETED: "COMPLETED",
  INSUFFICIENT: "INSUFFICIENT",
  ERROR: "ERROR",
} as const;

export const PaymentMethod = {
  NONE: "NONE",
  CASH: "CASH",
  CARD: "CARD",
  COIN: "COIN",
} as const;

export const ErrorCode = {
  NONE: "E000",
  INSUFFICIENT_CHANGE: "E101",
  DISPENSE_FAILURE: "E201",
  CARD_READER_ERROR: "E301",
  NETWORK_ERROR: "E302",
  INVENTORY_SENSOR_ERROR: "E401",
  BILL_VALIDATOR_ERROR: "E501",
  COIN_VALIDATOR_ERROR: "E601",
  SYSTEM_ERROR: "E999",
} as const;
