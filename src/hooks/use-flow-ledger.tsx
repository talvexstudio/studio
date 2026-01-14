'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Account, Category, Subcategory, Transaction, Workspace, User } from '@/lib/types';
import { getAccounts } from '@/lib/services/accounts';
import { getCategories } from '@/lib/services/categories';
import { getTransactions } from '@/lib/services/transactions';
import { getWorkspaces } from '@/lib/services/workspaces';
import { mockAuth } from '@/lib/services/auth';

interface FlowLedgerContextType {
  user: User | null;
  workspaces: Workspace[];
  workspaceId: string | null;
  setWorkspaceId: (id: string) => void;
  accounts: Account[];
  transactions: Transaction[];
  categories: (Category & { subcategories: Subcategory[] })[];
  reloadWorkspaces: () => Promise<void>;
  reloadAccounts: () => Promise<void>;
  reloadTransactions: () => Promise<void>;
}

const FlowLedgerContext = createContext<FlowLedgerContextType | undefined>(undefined);

export const FlowLedgerProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<(Category & { subcategories: Subcategory[] })[]>([]);

  const fetchWorkspaces = useCallback(async () => {
    if (!user) return;
    const userWorkspaces = await getWorkspaces(user.uid);
    setWorkspaces(userWorkspaces);
    if (userWorkspaces.length > 0 && !workspaceId) {
      setWorkspaceId(userWorkspaces[0].id);
    } else if (userWorkspaces.length === 0) {
      setWorkspaceId(null);
    }
  }, [user, workspaceId]);
  
  const fetchAccounts = useCallback(async () => {
    if (!workspaceId) {
        setAccounts([]);
        return;
    };
    const workspaceAccounts = await getAccounts(workspaceId);
    setAccounts(workspaceAccounts);
  }, [workspaceId]);

  const fetchTransactions = useCallback(async () => {
    if (!workspaceId) {
        setTransactions([]);
        return;
    };
    const workspaceTransactions = await getTransactions(workspaceId);
    setTransactions(workspaceTransactions);
  }, [workspaceId]);

  const fetchCategories = useCallback(async () => {
    const systemCategories = await getCategories();
    setCategories(systemCategories);
  }, []);

  // Initial data loading
  useEffect(() => {
    setUser(mockAuth.currentUser); // Simulate user login
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (user) {
        fetchWorkspaces();
    }
  }, [user, fetchWorkspaces]);

  useEffect(() => {
    if (workspaceId) {
        fetchAccounts();
        fetchTransactions();
    } else {
        // If workspaceId is null (e.g., after creating the very first one), clear data
        setAccounts([]);
        setTransactions([]);
    }
  }, [workspaceId, fetchAccounts, fetchTransactions]);

  const value = {
    user,
    workspaces,
    workspaceId,
    setWorkspaceId,
    accounts,
    transactions,
    categories,
    reloadWorkspaces: fetchWorkspaces,
    reloadAccounts: fetchAccounts,
    reloadTransactions: fetchTransactions,
  };

  return <FlowLedgerContext.Provider value={value}>{children}</FlowLedgerContext.Provider>;
};

export const useFlowLedger = () => {
  const context = useContext(FlowLedgerContext);
  if (context === undefined) {
    throw new Error('useFlowLedger must be used within a FlowLedgerProvider');
  }
  return context;
};
