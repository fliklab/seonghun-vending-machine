// ===== Simulation Timing Constants (in milliseconds) =====

// Bill Validator Timing
export const BILL_INSERT_DELAY = 300;
export const BILL_VALIDATION_DELAY = 800;
export const BILL_REJECTION_RESET_DELAY = 1000;
export const BILL_STACKING_DELAY = 300;
export const BILL_RESET_DELAY = 300;

// Coin Validator Timing
export const COIN_INSERT_DELAY = 200;
export const COIN_VALIDATION_DELAY = 500;
export const COIN_REJECTION_RESET_DELAY = 1000;
export const COIN_STORAGE_DELAY = 300;
export const COIN_RESET_DELAY = 300;

// Card Reader Timing
export const CARD_READING_DELAY = 800;
export const CARD_PROCESSING_DELAY = 1500;

// Dispenser Timing
export const DISPENSER_START_DELAY = 500;
export const DISPENSER_OPERATION_DELAY = 2000;
export const DISPENSER_RESET_DELAY = 500;

// Change Dispenser Timing
export const CHANGE_START_DELAY = 500;
export const CHANGE_ITEM_INTERVAL = 300;
export const CHANGE_COMPLETE_DELAY = 500;
export const NO_CHANGE_DELAY = 300;

// Timer Update Interval
export const TIMER_UPDATE_INTERVAL = 100;

// ===== Simulation Probability Constants =====

// Bill Validator Probabilities
export const BILL_REJECTION_RATE = 0.05; // 5% rejection rate
export const BILL_ACCEPTANCE_THRESHOLD = 0.95; // Math.random() > 0.95 means reject

// Coin Validator Probabilities
export const COIN_REJECTION_RATE = 0.03; // 3% rejection rate
export const COIN_ACCEPTANCE_THRESHOLD = 0.97; // Math.random() > 0.97 means reject

// Card Payment Probabilities
export const CARD_APPROVAL_RATE = 0.85; // 85% approval rate
export const CARD_DECLINE_THRESHOLD = 0.15; // Math.random() > 0.15 means approve

// Dispenser Probabilities
export const DISPENSER_SUCCESS_RATE = 0.95; // 95% success rate
export const DISPENSER_JAM_THRESHOLD = 0.05; // Math.random() > 0.05 means success
