export const OperationError = {
  None: "none",
  Get: "get",
  Toggle: "toggle",
  Submit: "submit",
} as const;

export type OperationError =
  (typeof OperationError)[keyof typeof OperationError];
