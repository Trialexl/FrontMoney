// API Types для Django LK Finance

export interface User {
  id: string
  username: string
  email: string
  full_name?: string
  status: 'COMP' | 'PRIV'
  first_name: string
  last_name: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  username: string
  password: string
}

// Справочники
export interface CashFlowItem {
  id: string
  code?: string
  name?: string
  deleted: boolean
  include_in_budget?: boolean
  parent?: string
}

export interface Wallet {
  id: string
  code?: string
  name?: string
  deleted: boolean
  hidden: boolean
}

export interface Project {
  id: string
  code?: string
  name?: string
  deleted: boolean
}

// Финансовые операции
export interface Receipt {
  id: string
  number: string
  date: string
  deleted: boolean
  amount: string
  comment?: string
  wallet?: string
  cash_flow_item?: string
}

export interface Expenditure {
  id: string
  number: string
  date: string
  deleted: boolean
  amount: string
  comment?: string
  wallet?: string
  cash_flow_item?: string
  include_in_budget: boolean
}

export interface Transfer {
  id: string
  number: string
  date: string
  deleted: boolean
  amount: string
  comment?: string
  wallet_in?: string
  wallet_out?: string
  cash_flow_item?: string
  include_in_budget: boolean
}

export interface Budget {
  id: string
  number: string
  date: string
  deleted: boolean
  date_start: string
  amount: string
  amount_month: number
  comment?: string
  cash_flow_item?: string
  project?: string
  type_of_budget: boolean // true = Приход, false = Расход
}

export interface AutoPayment {
  id: string
  number: string
  date: string
  deleted: boolean
  wallet_in?: string
  wallet_out?: string
  cash_flow_item?: string
  is_transfer: boolean
  amount_month: number
  amount: string
  comment?: string
  date_start: string
}

// Графики планирования
export interface ExpenditureGraphic {
  id: string
  document: string
  date_start: string
  amount: string
}

export interface TransferGraphic {
  id: string
  document: string
  date_start: string
  amount: string
}

export interface BudgetGraphic {
  id: string
  document: string
  date_start: string
  amount: string
}

export interface AutoPaymentGraphic {
  id: string
  document: string
  date_start: string
  amount: string
}

// Регистры
export interface FlowOfFunds {
  id: string
  document_id?: string
  period: string
  type_of_document: number
  wallet?: string
  cash_flow_item?: string
  amount: string
}

export interface BudgetExpense {
  id: string
  document_id?: string
  period: string
  type_of_document: number
  project?: string
  cash_flow_item?: string
  amount: string
}

export interface BudgetIncome {
  id: string
  document_id?: string
  period: string
  type_of_document: number
  project?: string
  cash_flow_item?: string
  amount: string
}

// API Response types
export interface ApiResponse<T> {
  count: number
  next?: string
  previous?: string
  results: T[]
}

export interface ApiError {
  detail?: string
  [key: string]: any
}

// Form types
export interface CreateReceiptForm {
  number: string
  date: string
  amount: number
  comment?: string
  wallet: string
  cash_flow_item: string
}

export interface CreateExpenditureForm {
  number: string
  date: string
  amount: number
  comment?: string
  wallet: string
  cash_flow_item: string
  include_in_budget: boolean
}

export interface CreateTransferForm {
  number: string
  date: string
  amount: number
  comment?: string
  wallet_in: string
  wallet_out: string
  cash_flow_item: string
  include_in_budget: boolean
}

export interface CreateBudgetForm {
  number: string
  date: string
  date_start: string
  amount: number
  amount_month: number
  comment?: string
  cash_flow_item: string
  project?: string
  type_of_budget: boolean
}

export interface CreateAutoPaymentForm {
  number: string
  date: string
  wallet_in?: string
  wallet_out?: string
  cash_flow_item?: string
  is_transfer: boolean
  amount_month: number
  amount: number
  comment?: string
  date_start: string
}