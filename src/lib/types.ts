export type Workspace = {
  id: string;
  ownerUserId: string;
  name: string;
  baseCurrency: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Account = {
  id: string;
  workspaceId: string;
  name: string;
  type: 'bank' | 'credit_card' | 'fintech' | 'cash' | 'investment' | 'other';
  currency: string;
  institution: string;
  openingBalance: number;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Transaction = {
  id: string;
  workspaceId: string;
  accountId: string;
  date: Date;
  valueDate?: Date;
  description: string;
  rawDescription: string;
  amountOriginal: number;
  currencyOriginal: string;
  amountBase: number;
  exchangeRate?: number;
  balanceAfter?: number;
  type: 'Expense' | 'Income' | 'InternalTransfer' | 'Adjustment';
  categoryId?: string;
  subcategoryId?: string;
  needsReview: boolean;
  isInternalTransfer: boolean;
  isPotentialDuplicate: boolean;
  isInconsistent: boolean;
  sourceFileId?: string;
  sourceAccountName?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: string;
  workspaceId?: string | null;
  name: string;
  type: 'expense' | 'income' | 'both';
  order: number;
  isSystem: boolean;
};

export type Subcategory = {
  id:string;
  workspaceId?: string | null;
  categoryId: string;
  name: string;
  order: number;
  isSystem: boolean;
};

export type ClassificationRule = {
  id: string;
  workspaceId: string;
  priority: number;
  matchField: "description" | "rawDescription" | "sourceAccountName";
  matchType: "contains" | "startsWith" | "equals" | "regex";
  matchValue: string;
  matchAmountMin?: number;
  matchAmountMax?: number;
  assignType?: 'Expense' | 'Income' | 'InternalTransfer';
  assignCategoryId: string;
  assignSubcategoryId: string;
  setInternalTransfer?: boolean;
  setNeedsReview?: boolean;
  active: boolean;
};

export type ImportTemplate = {
  id: string;
  name: string;
  // This would be a more complex object defining mappings
  mapping: any; 
};

export type Budget = {
  id: string;
  workspaceId: string;
  year: number;
  createdFromSampleMonths: number;
  samplePeriodFrom: string; // "YYYY-MM"
  samplePeriodTo: string; // "YYYY-MM"
  createdAt: Date;
};

export type BudgetLine = {
  id: string;
  budgetId: string;
  type: 'Expense' | 'Income';
  categoryId: string;
  subcategoryId: string;
  totalSample: number;
  monthlyAverage: number;
  annualBudget: number;
  percentageOfType: number;
  userAdjustedMonthly?: number;
  userAdjustedAnnual?: number;
};
