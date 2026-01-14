import { db } from './firestore';
import { mockAccounts, mockTransactions } from '../data';
import type { Account, Transaction } from '../types';

const generateRandomAmount = (min: number, max: number) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

const generateDemoProfileA = () => {
    const accounts = [
        { id: 'acc1', workspaceId: 'ws1', name: 'Household Checking', type: 'bank', currency: 'EUR', institution: 'Main Bank', openingBalance: 1500, archived: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 'acc2', workspaceId: 'ws1', name: 'Personal Savings', type: 'bank', currency: 'EUR', institution: 'Savings Bank', openingBalance: 5000, archived: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 'acc3', workspaceId: 'ws1', name: 'Groceries Card', type: 'credit_card', currency: 'EUR', institution: 'Supermarket CC', openingBalance: 0, archived: false, createdAt: new Date(), updatedAt: new Date() },
    ];
    const transactions = [
         { id: 'txn_a1', accountId: 'acc1', date: new Date(new Date().setDate(2)), description: 'Monthly Rent', amountBase: -1200, categoryId: 'cat_housing', subcategoryId: 'sub_rent', needsReview: false, },
         { id: 'txn_a2', accountId: 'acc1', date: new Date(new Date().setDate(28)), description: 'Salary Deposit', amountBase: 3500, categoryId: 'cat_income', subcategoryId: 'sub_salary', needsReview: false, },
         { id: 'txn_a3', accountId: 'acc3', date: new Date(new Date().setDate(5)), description: 'Weekly Groceries', amountBase: -generateRandomAmount(80, 120), categoryId: 'cat_groceries', subcategoryId: 'sub_supermarket', needsReview: true, },
         { id: 'txn_a4', accountId: 'acc3', date: new Date(new Date().setDate(12)), description: 'Groceries', amountBase: -generateRandomAmount(70, 110), categoryId: 'cat_groceries', subcategoryId: 'sub_supermarket', needsReview: false, },
         { id: 'txn_a5', accountId: 'acc1', date: new Date(new Date().setDate(8)), description: 'Dinner with Family', amountBase: -generateRandomAmount(50, 90), categoryId: 'cat_restaurants', subcategoryId: 'sub_restaurants', needsReview: true, },
         { id: 'txn_a6', accountId: 'acc1', date: new Date(new Date().setDate(10)), description: 'Spotify', amountBase: -9.99, categoryId: 'cat_subscriptions', subcategoryId: 'sub_music', needsReview: false, },
         { id: 'txn_a7', accountId: 'acc1', date: new Date(new Date().setDate(15)), description: 'Train ticket', amountBase: -generateRandomAmount(30, 50), categoryId: 'cat_transport', subcategoryId: 'sub_public_transport', needsReview: false, },
         { id: 'txn_a8', accountId: 'acc3', date: new Date(new Date().setDate(20)), description: 'Amazon Purchase', amountBase: -generateRandomAmount(20, 60), categoryId: 'cat_shopping', subcategoryId: 'sub_home_diy', needsReview: true, },
    ];
    return { accounts, transactions };
}

const generateDemoProfileB = () => {
    const accounts = [
        { id: 'acc_b1', workspaceId: 'ws1', name: 'Business Main (EUR)', type: 'fintech', currency: 'EUR', institution: 'Wise', openingBalance: 2500, archived: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 'acc_b2', workspaceId: 'ws1', name: 'Personal Revolut', type: 'fintech', currency: 'EUR', institution: 'Revolut', openingBalance: 300, archived: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 'acc_b3', workspaceId: 'ws1', name: 'Amex Business', type: 'credit_card', currency: 'USD', institution: 'American Express', openingBalance: -200, archived: false, createdAt: new Date(), updatedAt: new Date() },
    ];
     const transactions = [
         { id: 'txn_b1', accountId: 'acc_b1', date: new Date(new Date().setDate(3)), description: 'Client A Payment', amountBase: generateRandomAmount(1500, 2500), categoryId: 'cat_income', subcategoryId: 'sub_salary', needsReview: false, },
         { id: 'txn_b2', accountId: 'acc_b2', date: new Date(new Date().setDate(5)), description: 'Transfer to Personal', amountBase: 500, categoryId: 'cat_transfers', subcategoryId: 'sub_transfers', needsReview: false, isInternalTransfer: true },
         { id: 'txn_b3', accountId: 'acc_b1', date: new Date(new Date().setDate(5)), description: 'Transfer from Business', amountBase: -500, categoryId: 'cat_transfers', subcategoryId: 'sub_transfers', needsReview: false, isInternalTransfer: true },
         { id: 'txn_b4', accountId: 'acc_b3', date: new Date(new Date().setDate(8)), description: 'Figma Subscription', amountBase: -15, categoryId: 'cat_subscriptions', subcategoryId: 'sub_apps', needsReview: false, },
         { id: 'txn_b5', accountId: 'acc_b3', date: new Date(new Date().setDate(10)), description: 'AWS Hosting', amountBase: -generateRandomAmount(50, 150), categoryId: 'cat_subscriptions', subcategoryId: 'sub_apps', needsReview: true, },
         { id: 'txn_b6', accountId: 'acc_b2', date: new Date(new Date().setDate(11)), description: 'WeWork Hotdesk', amountBase: -35, categoryId: 'cat_housing', subcategoryId: 'sub_maintenance', needsReview: false, },
         { id: 'txn_b7', accountId: 'acc_b2', date: new Date(new Date().setDate(12)), description: 'Uber Eats', amountBase: -generateRandomAmount(20, 40), categoryId: 'cat_restaurants', subcategoryId: 'sub_delivery', needsReview: true, },
         { id: 'txn_b8', accountId: 'acc_b1', date: new Date(new Date().setDate(18)), description: 'Client B Payment', amountBase: generateRandomAmount(2000, 3000), categoryId: 'cat_income', subcategoryId: 'sub_salary', needsReview: false, },
    ];
    return { accounts, transactions };
}


export const seedDemoData = async (workspaceId: string) => {
    const accountsPath = `workspaces/${workspaceId}/accounts`;
    const transactionsPath = `workspaces/${workspaceId}/transactions`;

    // Alternate between profiles
    const profileKey = `profile_${workspaceId}`;
    const lastProfile = localStorage.getItem(profileKey);
    const { accounts, transactions } = lastProfile === 'A' ? generateDemoProfileB() : generateDemoProfileA();
    localStorage.setItem(profileKey, lastProfile === 'A' ? 'B' : 'A');

    // Seed Accounts
    for (const account of accounts) {
        const { id, ...accountData } = account;
        const newAccountData: Omit<Account, 'id' | 'workspaceId'> = {
            ...accountData,
            workspaceId,
        };
        await db.collection(accountsPath).doc(id).set(newAccountData);
    }

    // Seed Transactions
    for (const transaction of transactions) {
        const { id, accountId, date, description, amountBase, categoryId, subcategoryId, needsReview, isInternalTransfer } = transaction;

        const newTransactionData: Omit<Transaction, 'id' | 'workspaceId'> = {
            accountId,
            date: new Date(date),
            description,
            rawDescription: description.toUpperCase(),
            amountOriginal: amountBase,
            currencyOriginal: 'EUR',
            amountBase,
            type: amountBase > 0 ? (isInternalTransfer ? 'InternalTransfer' : 'Income') : (isInternalTransfer ? 'InternalTransfer' : 'Expense'),
            categoryId,
            subcategoryId,
            needsReview: !!needsReview,
            isInternalTransfer: !!isInternalTransfer,
            isPotentialDuplicate: false,
            isInconsistent: false,
            workspaceId,
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
