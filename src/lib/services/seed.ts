import { db } from './firestore';
import { mockAccounts, mockTransactions } from '../data';
import type { Account, Transaction } from '../types';

export const seedDemoData = async (workspaceId: string) => {
    const accountsPath = `workspaces/${workspaceId}/accounts`;
    const transactionsPath = `workspaces/${workspaceId}/transactions`;

    // Seed Accounts
    for (const account of mockAccounts) {
        const { id, ...accountData } = account;
        const newAccountData: Omit<Account, 'id' | 'workspaceId'> = {
            ...accountData,
            workspaceId,
        };
        // Use a consistent ID for demo data if needed, or generate new ones
        await db.collection(accountsPath).doc(id).set(newAccountData);
    }

    // Seed Transactions
    for (const transaction of mockTransactions) {
        const { id, ...transactionData } = transaction;
        const newTransactionData: Omit<Transaction, 'id' | 'workspaceId'> = {
            ...transactionData,
            workspaceId,
            date: new Date(transaction.date) // Ensure date is a Date object
        };
        await db.collection(transactionsPath).doc(id).set(newTransactionData);
    }
};

export const clearWorkspaceData = async (workspaceId: string) => {
    const accountsPath = `workspaces/${workspaceId}/accounts`;
    const transactionsPath = `workspaces/${workspaceId}/transactions`;

    db.clearCollection(accountsPath);
    db.clearCollection(transactionsPath);

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
};
