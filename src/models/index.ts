export interface Expense {
  id: number;
  name: string;
  category: string;
  payment: string;
  freq: number;
  duedate: string;
  amount: number;
  weekly: number;
  categoryid: number;
}

export interface Budget {
  name: string;
  categoryid: number;
  fullname: string;
  total: number;
}

export interface BillType {
  id: number;
  name: string;
  category: string;
  payment: string;
  freq: number;
  duedate: string;
  amount: number;
}

export interface BillTrendType {
  year: number;
  month: number;
  amount: number;
}

export interface ExpenseTrendView {
  period: string;
  amount: number;
  monthAmount: number;
  total: number;
}

export interface Category {
  id: number;
  name: string;
  fullname: string;
}

export interface Wallet {
  name: string;
  amount: number;
  target: number;
}

export interface ViewWallet {
  name: string;
  pct: number;
  amount: number;
  weekly: number;
}

export interface Flow {
  name: string;
  type: string;
  account: string;
  interval: string;
  debit: number;
  credit: number;
}

export interface FlowTotal {
  debit: number;
  credit: number;
}

export interface FlowView {
  week: string;
  name: string;
  type: string;
  account: string;
  interval: number;
  amount: number;
}

export interface IncomeType {
  name: string;
  account: string;
  interval: string;
  weekly: number;
  amount: number;
}

export interface Income {
  name: string;
  interval: number;
  period: number;
  amount: number;
}

export interface Tracking {
  period: string;
  categoryid: number;
  total: number;
}

export interface TrackingMonth {
  period: string;
  categoryid: number;
  total: number;
}

export interface BudgetItem {
  name: string;
  total: number;
  actual: number;
  monthly: number;
  save: number;
}

export interface BudgetGroup {
  auto: BudgetItem;
  electricity: BudgetItem;
}

export interface BudgetMonthly {
  period: string;
  category: string;
  total: number;
  actual: number;
  monthly: number;
  save: number;
}

export interface Position {
  id: number;
  pos_type: string;
  evt_date: string;
  home: number;
  super_kate: number;
  super_dan: number;
  cash: number;
  debt: number;
  income: number;
  expense: number;
  total: number;
}