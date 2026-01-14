import { db } from "./firestore";
import type { Transaction } from "../types";

const transactionsCollection = (workspaceId: string) => `workspaces/${workspaceId}/transactions`;

export const getTransactions = async (workspaceId: string): Promise<Transaction[]> => {
    const snapshot = await db.collection(transactionsCollection(workspaceId)).get();
    return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return { 
            id: doc.id, 
            ...data,
            date: new Date(data.date), // Ensure date is a Date object
        } as Transaction;
    });
}

export const saveTransaction = async (transactionData: Partial<Transaction>) => {
    if (!transactionData.id || !transactionData.workspaceId) {
        throw new Error("Transaction ID and Workspace ID are required to save.");
    }
    const { id, workspaceId, ...data } = transactionData;
    await db.collection(transactionsCollection(workspaceId)).doc(id).set(data, { merge: true });
}

export const confirmTransaction = async (transactionId: string) => {
    const transaction = await db.findDoc(doc => doc.id === transactionId, 'transactions');
    if (!transaction) throw new Error("Transaction not found");

    await db.collection(transactionsCollection(transaction.workspaceId)).doc(transactionId).update({ needsReview: false });
}
