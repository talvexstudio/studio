import { db, hasTransactionsForAccount } from "./firestore";
import type { Account } from "../types";

const accountsCollection = (workspaceId: string) => `workspaces/${workspaceId}/accounts`;

export const getAccounts = async (workspaceId: string): Promise<Account[]> => {
    const snapshot = await db.collection(accountsCollection(workspaceId)).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account));
}

export const saveAccount = async (workspaceId: string, accountData: Partial<Account>) => {
    const coll = db.collection(accountsCollection(workspaceId));
    if (accountData.id) {
        const { id, ...data } = accountData;
        await coll.doc(id).set(data, { merge: true });
        return { ...data, id };
    } else {
        const docRef = await coll.add({
            ...accountData,
            archived: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return { ...accountData, id: docRef.id };
    }
}

export const archiveAccount = async (accountId: string) => {
    const account = await db.findDoc(doc => doc.id === accountId, 'accounts');
    if (!account) throw new Error("Account not found");
    
    await db.collection(accountsCollection(account.workspaceId)).doc(accountId).update({ archived: true });
}

export const deleteAccount = async (accountId: string) => {
    const account = await db.findDoc(doc => doc.id === accountId, 'accounts');
    if (!account) throw new Error("Account not found");

    if (await hasTransactionsForAccount(account.workspaceId, accountId)) {
        throw new Error("This account has transactions and cannot be deleted.");
    }
    
    await db.collection(accountsCollection(account.workspaceId)).doc(accountId).delete();
}
