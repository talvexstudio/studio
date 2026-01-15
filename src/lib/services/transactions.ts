import { db } from "./firestore";
import type { Transaction } from "../types";

const transactionsCollection = (workspaceId: string) => `workspaces/${workspaceId}/transactions`;

const normalizeAmountBase = (transactionData: Partial<Transaction>) => {
    if (typeof transactionData.amountBase !== 'number' || !transactionData.type) {
        return transactionData;
    }
    const absAmount = Math.abs(transactionData.amountBase);
    if (transactionData.type === 'Expense') {
        return { ...transactionData, amountBase: -absAmount };
    }
    if (transactionData.type === 'Income') {
        return { ...transactionData, amountBase: absAmount };
    }
    return transactionData;
}

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
    const coll = db.collection(transactionsCollection(workspaceId));
    const normalizedData = normalizeAmountBase(transactionData);
    if (transactionData.id) {
        const { id, ...data } = normalizedData;
        await coll.doc(id).set(data, { merge: true });
        return { ...data, id };
    } else {
        const docRef = await coll.add({
            ...normalizedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const newTransaction = { ...normalizedData, id: docRef.id };
        return newTransaction;
    }
}

export const confirmTransaction = async (workspaceId: string, transactionId: string) => {
    await db.collection(transactionsCollection(workspaceId)).doc(transactionId).update({ needsReview: false });
}

export const deleteTransaction = async (workspaceId: string, transactionId: string) => {
    await db.collection(transactionsCollection(workspaceId)).doc(transactionId).delete();
}
