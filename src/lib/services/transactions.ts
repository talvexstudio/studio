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

export const saveTransaction = async (workspaceId: string, transactionData: Partial<Transaction>) => {
    if (!transactionData.id) {
        throw new Error("Transaction ID is required to save.");
    }
    const { id, ...data } = transactionData;
    await db.collection(transactionsCollection(workspaceId)).doc(id).set(data, { merge: true });
}

export const confirmTransaction = async (workspaceId: string, transactionId: string) => {
    await db.collection(transactionsCollection(workspaceId)).doc(transactionId).update({ needsReview: false });
}
